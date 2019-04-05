'use strict';

/* jshint ignore:start */

const should = require('should'),
    {IPCJob} = require('../parts/jobs/job.js'),
    {Resource} = require('../parts/jobs/resource.js'),
    {NoRetryPolicy} = require('../parts/jobs/retry.js');

/** Class for testing resource handling for jobs **/
class TestResource extends Resource {
    /** 
    * Open resource 
    * @returns {Promise} promise
    **/
    open() {
        console.log('resource: opening in %d', process.pid);
        this.opened();
        this.openedTime = Date.now();
        return Promise.resolve();
    }

    /** 
    * Close resource 
    * @returns {Promise} promise
    **/
    close() {
        console.log('resource: closing in %d', process.pid);
        this.closed();
        return Promise.resolve();
    }

    /** 
    * Kill resource 
    * @returns {Promise} promise
    **/
    kill() {
        console.log('resource: killed in %d', process.pid);
        return Promise.resolve();
    }

    /** 
    * Check if resource is used 
    * @returns {Promise} promise
    **/
    checkActive() {
        console.log('resource: checkActive in %d', process.pid);
        return Promise.resolve(Date.now() - this.openedTime < 20000);
    }

    /** Start using resource **/
    start() {
        this.openedTime = Date.now();
        super.start.apply(this, arguments);
    }
}
/** Class for testing ipc jobs **/
class IPCTestJob extends IPCJob {
    /**
     * Prepare the job
     * @param {object} manager - resource manager
     * @param {Db} db - db connection
     */
    async prepare(manager, db) {
        console.log('preparing in %d', process.pid);
        await new Promise((res, rej) => db.collection('jobs').updateOne({_id: this._id}, {$set: {'data.prepared': 1}}, err => err ? rej(err) : res()));
    }

    /** 
    * Get resource name 
    * @returns {string} resource name
    **/
    resourceName() {
        return 'resource:test';
    }

    /**
     * Create resource
     * @param {string} _id - resource _id
     * @param {string} name - resource name
     * @param {Db} db - db connection
     * @returns {Resource} resource
     */
    createResource(_id, name, db) {
        return new TestResource(_id, name, db);
    }

    /** 
    * Get retry policy 
    * @returns {RetryPolicy} retry policy
    **/
    retryPolicy() {
        return new NoRetryPolicy();
    }

    /** 
    * Get concurrency 
    * @returns {number} concurency
    **/
    getConcurrency() {
        return this.data && this.data.concurrency || 0;
    }

    /**
     * Run the job
     * @param {Db} db connection
     */
    async run(db) {
        console.log('running in %d', process.pid);
        should.exist(this.resource);
        (this.resource instanceof TestResource).should.be.true();
        await new Promise((res, rej) => db.collection('jobs').updateOne({_id: this._id}, {$set: {'data.run': 1}}, err => err ? rej(err) : res()));

        if (this.data && this.data.fail) {
            throw new Error(this.data.fail);
        }

        if (this.data && this.data.concurrency) {
            await new Promise(res => setTimeout(res, 3000));
        }

        console.log('done running in %d', process.pid);
    }
}

module.exports = IPCTestJob;