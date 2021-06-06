## Crud App in NestJS and MongoDB

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```



### APIS
1. Add task
    - https://nest-mongo-crud.herokuapp.com/tasks
    - Type: POST
    
    User can create a task with the following details
    - title
    - description
    - media (Image or Video anyone in a task)
    - target_date
    - status (Todo, In-progress, Done)

2. User can see the task details
    - https://nest-mongo-crud.herokuapp.com/tasks/{taskId}
    - Type: GET

3. Search/Get all tasks
    - https://nest-mongo-crud.herokuapp.com/tasks?search=wake&&start=0&&limit=20&&sortBy=1
    - Type: GET

    User should be able to see the list of Task already created
        - Default 20 tasks else pagination can be done using `start` and `limit`
        - Users can search the task with the `title` and `description`.
        - User can sort the task based on the `target_date` default is ascending

4. User can update the task details from the detail screen
    - https://nest-mongo-crud.herokuapp.com/tasks/{taskId}
    - Type: PATCH

    User can update task with the following details
    - title
    - description
    - media (Image or Video anyone in a task)
    - target_date
    - status (Todo, In-progress, Done)

5. Users can remove any task from the available tasks and allowed to remove multiple tasks at a time.
    - https://nest-mongo-crud.herokuapp.com/tasks/{taskId}
    - Type: DELETE        



### DB structure
DB has one collection called tasks which have below fields
{ 
    "_id"                   // MongoDB ObjectID
    "title" :               // Title of task, also a index field for search
    "description"           // description of task, also a index field for search    
    "media"                 // media added with task
    "target_date"           // target date for task
    "status"                // status of current task
    "isActive"              // isActive, can be used in case of soft delete
}
