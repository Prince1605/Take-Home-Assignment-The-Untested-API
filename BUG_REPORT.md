# Bug Report

## Bug 1: Incorrect Pagination Logic

**Location:**  
src/services/taskService.js

**Issue:**  
Pagination returns incorrect results. The first page skips initial tasks.

**Cause:**  
Offset is calculated as: offset = page * limit

This causes the first page to start from the wrong index.

**Example:**
- page = 1, limit = 2  
- offset = 2 → starts from 3rd task instead of 1st  

##  Fix

Updated the offset calculation:

```js
const offset = (page - 1) * limit;

##  Bug 2: Incorrect Status Filtering

**Location:**  
src/services/taskService.js

**Issue:**  
Filtering tasks by status may return incorrect results.

**Cause:**  
The code uses:
t.status.includes(status)


**FIX** (suggestion)
t.status === status
---------------------------------------------------
---

##  Feature: Assign Task to User

**Endpoint:**  
PATCH /tasks/:id/assign

**Description:**  
This API assigns a task to a user by adding an `assignedTo` field to the task.

**Request Body:**
{ "userId": "string" }

**Approach:**
- Extracted `userId` from request body
- Validated that `userId` is provided
- Checked if task exists
- Added `assignedTo` field to the task

**Edge Cases Handled:**
- Missing `userId` → returns 400  
- Task not found → returns 404  

**Design Decision:**
Assignment is handled separately from task creation to keep responsibilities clear and flexible.


-----------Submission Ques Ans----------
1->What I'd test next if I had more time

I would test more edge cases like pagination with large data, invalid query parameters, and concurrent updates. I would also test performance when handling a large number of tasks.

2. What surprised me in the codebase

I found the pagination bug interesting because the logic looked correct at first but produced incorrect results. Also, since the data is stored in memory, it required careful handling during testing.

3. Questions before shipping to production
->Should userId be validated against a real user system before assigning a task?
->Should the data be stored in a database instead of in-memory storage?
->How will authentication and authorization be handled?