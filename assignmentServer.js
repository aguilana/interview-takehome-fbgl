const { loadVolunteers, loadTasks, getVolunteerSatisfactionScore } = require("./util");
const { Volunteer } = require("./volunteer");
const { Task } = require("./task");

class AssignmentServer {
    constructor() {
        /** @private {!Map<Volunteer, Set<Task>>} A map of Volunteers to assigned Tasks. */
        this.assignments = new Map();

        /** @private {!Map<number, Task>} A map of task ids to Tasks. */
        this.tasks = new Map();

        /** @private {!Array<Volunteer>} The list of all volunteers. */
        this.volunteers = [];
    }

    async importTasksFromCSV(csvFileName) {
        this.tasks = await loadTasks(csvFileName);
    }

    async importVolunteersFromCSV(csvFileName) {
        this.volunteers.push(...(await loadVolunteers(csvFileName, this.tasks)));
    }

    /**
     * Returns an Array of the volunteers who have indicated interest in the 
     * given task.
     * @param {Task} task the task to find interested Volunteers for
     *
     * @return {!Array<Volunteer>} the volunteers
     */

    // solution one
    /*     getInterestedVolunteers(task) {
            // TODO Implement this method.
            const interestedVolunteers = []
            for (let volunteer of this.volunteers) {
                if (volunteer.isInterested(task)) {
                    interestedVolunteers.push(volunteer)
                }
            }
            return interestedVolunteers
        } */

    // solution two - optimized
    getInterestedVolunteers(task) {
        return this.volunteers.filter((volunteer) => volunteer.isInterested(task))
    }

    /**
     * Returns a List of Tasks sorted by desirability.
     * 
     * @return {!Array<Task>} the tasks
     */
    getTasksByDesirability() {
        // TODO: Implement this method.

        const tasksWithSum = []

        for (let task of this.tasks.values()) {
            // for each task I want to get a desirability score based on the volunteer

            let sum = 0;

            for (let volunteer of this.volunteers) {

                const desirabilityScore = volunteer.getTaskDesirabilityScore(task)
                sum += desirabilityScore
            }

            tasksWithSum.push({ task, sum })

        }

        // sort the tasks with sum
        tasksWithSum.sort((a, b) => b.sum - a.sum)
        console.log("tasksWithSum", tasksWithSum)

        const sortedNonPeopleFacingArray = []
        const sortedPeopleFacingArray = []

        for (let taskWithSum of tasksWithSum) {
            if (taskWithSum.task.isPeopleFacing()) {
                sortedPeopleFacingArray.push(taskWithSum.task)
            } else {
                sortedNonPeopleFacingArray.push(taskWithSum.task)
            }
        }

        const finalizedSortedArrayofTasks = [...sortedPeopleFacingArray, ...sortedNonPeopleFacingArray]
        console.log("FINAL RESULTS ---->", finalizedSortedArrayofTasks)
        return finalizedSortedArrayofTasks
    }


    /**
     * Assigns Tasks to Volunteers by inserting them into the assignment map,
     * in order of desirability. Tasks are assigned to the first Volunteer with
     * interest. If there are no interested Volunteers, they are assigned to the
     * first available Volunteer.
     */
    assignTasks() {

        for (const task of this.getTasksByDesirability()) {

            const interestedVolunteers = this.getInterestedVolunteers(task);


            if (interestedVolunteers.length > 0) {
                this.assignTask(task, interestedVolunteers[0]);
            } else if (this.volunteers.length > 0) {
                this.assignTask(task, this.volunteers[0]);
            }
        }
    }

    /**
     * Assigns Tasks to Volunteers based on their interests.
     */
    assignTasksImproved() {
        // TODO: Implement this method.
    }


    /**
     * Adds the given Task to the specified Volunteer's Set of assigned Tasks.
     *
     * @param {Task} task the task to assign
     * @param {Volunteer} volunteer the volunteer to assign the Task to
     */
    assignTask(task, volunteer) {
        if (!(this.assignments.has(volunteer))) {
            this.assignments.set(volunteer, new Set());
        }
        this.assignments.get(volunteer).add(task);
    }
}

module.exports = { AssignmentServer };