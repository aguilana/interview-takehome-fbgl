const { Task } = require("./task");

class Volunteer {
    /**
     * @param {string} name
     */
    constructor(name) {
        this.name = name;

        /** @private {!Array<Task>} The Tasks this Volunteer is interested in. */
        this.interestedTasks = [];
    }

    getName() {
        return this.name;
    }

    /**
     * Adds a Task to this Volunteer's interestedTasks array.
     * @param {Task} task
     */
    addInterestedTask(task) {
        this.interestedTasks.push(task);
    }

    /**
     * Removes a Task from this Volunteer's interestedTasks array.
     * @param {Task} task
     */
    removeInterestedTask(task) {
        this.interestedTasks = this.interestedTasks.filter(item => item != task);
    }

    /**
     * Returns whether this Volunteer is interested in the given Task.
     * @param {Task} task
     */
    isInterested(task) {
        return this.interestedTasks.includes(task);
    }

    /**
     * Returns a float representing how desirable the given task is to this
     * volunteer.
     * @param {Task} task
     */

    // `1 / (x + 1)` where x is the index of the task in the interested Tasks
    getTaskDesirabilityScore(task) {
        // TODO: Implement this method.
        const indexOfTask = this.interestedTasks.indexOf(task)
        if (indexOfTask !== -1) {
            return 1 / (indexOfTask + 1)
        }
        return 0;
    }


    toString() {
        return this.name;
    }
}

module.exports = { Volunteer };