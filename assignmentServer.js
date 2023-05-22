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
        // console.log("tasksWithSum", tasksWithSum)

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
        // console.log("FINAL RESULTS ---->", finalizedSortedArrayofTasks)
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
    /*     assignTasksImproved() {
            // TODO: Implement this method.
    
            // create a unique set of assigned tasks
            const assignedTasks = new Set()
            // create a unique set of assigned volunteers
            const assignedVolunteers = new Set()
    
            for (const task of this.getTasksByDesirability()) {
    
                console.log("TASK ONE THEN TWO --------------------->", task)
    
                if (assignedTasks.size === this.tasks.length) {
                    break;
                }
    
                // get the volunteers that are interested in the task and
                // filter array if volunteer is NOT in the assigned volunteers
                const interestedVolunteersArray = this.getInterestedVolunteers(task).filter((volunteer) => !assignedVolunteers.has(volunteer))
    
                // console.log("interestedVolunteersArray --->", interestedVolunteersArray)
                // we have the task and we have the volunteers that are interested in the task.
                // want to sort the array based on desirability from the user and assign
                interestedVolunteersArray.sort((a, b) => {
                    const rankA = a.interestedTasks.indexOf(task)
                    const rankB = b.interestedTasks.indexOf(task)
                    return rankA - rankB
                })
    
                console.log("VOLUNTEERS INTERESTED IN TASK ------------->", interestedVolunteersArray)
    
                // now we loop through the interestedVolunteers array
                for (const volunteer of interestedVolunteersArray) {
                    // assign the volunteer
                    this.assignTask(task, volunteer)
                    // add the task to the task set
                    assignedTasks.add(task)
                    // add the volunteer to the volunteer set
                    assignedVolunteers.add(volunteer)
                    break;
                }
            }
        } */

    assignTasksImproved() {
        // loop through the tasks
        for (const task of this.getTasksByDesirability()) {

            // get the array of interested volunteers and filter
            const interestedVolunteers = this.getInterestedVolunteers(task).filter((volunteer) => !this.assignments.has(volunteer))
            interestedVolunteers.sort((a, b) => {
                const rankA = a.interestedTasks.indexOf(task)
                const rankB = b.interestedTasks.indexOf(task)
                // return ascending order list 0,1,2,3, etc...lower === better
                return rankA - rankB
            })

            if (interestedVolunteers.length > 0) {
                const [volunteer] = interestedVolunteers
                console.log("this.assignments", this.assignments)
                console.log("VOLUNTEEEEEERKLSDHJFK:LDSJ", volunteer)
                this.assignTask(task, volunteer)
            }

        }
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