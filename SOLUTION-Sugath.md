# IVS
## Name - Sugath Fernando
## Email - sugathsathkorala@gmail.com
    
## Test Link
http://54.85.207.10:4000/echo

## Public Repository URL
https://github.com/sugathchaminda/IVS.git

## Testers Read Only Account Credentials
* Account Login URL - https://738665750289.signin.aws.amazon.com/console
* User Name - IVSReadOnlyUser
* Password - psalm54v2#

## Set Up Instructions
### Local Set Up
* 'git clone https://github.com/sugathchaminda/IVS.git' - Clone the repository
* Go to services/api folder and issue command 'yarn' to install the dependencies
* To start the application use 'yarn server:dev'
  - This will run the application on port 4000
  - 'http://localhost:4000/echo' is the endpoint
* To run the unit test 'yarn test' 

### Local Set Up - Docker
* The command for building an image is - 'docker build -t docker-on-aws'
    - Note : you need to install docker first
* Now we are going to run our newly created image and see docker in action
    'docker run -p 4000:4000 docker-on-aws'
    - You can now visit 'http://localhost:4000/echo'

### Deploy on AWS
* Create an IAM user with programmetic and setup our AWS CLI.
* Install AWS CLI locally
* Type aws configure and input the keys when prompted. Set your region as us-east-1

* To create ECS cluster run the command 'aws ecs create-cluster --cluster-name docker-aws'
* Push the image to ECR
    - Login to the ECR : aws ecr get-login --no-include-email
    - The output should be docker login -u AWS -p followed by a token, Copy and run that command also. It will be like 'docker login -u AWS -p <token> https://738665750289.dkr.ecr.us-east-1.amazonaws.com'
* Create ECR Repository
    - aws ecr create-repository --repository-name docker-aws/nodejs
    - Out put will be as follow
        `{
            "repository": {
                "repositoryUri": "738665750289.dkr.ecr.us-east-1.amazonaws.com/docker-on-aws/nodejs", 
                "imageScanningConfiguration": {
                    "scanOnPush": false
                }, 
                "encryptionConfiguration": {
                    "encryptionType": "AES256"
                }, 
                "registryId": "738665750289", 
                "imageTagMutability": "MUTABLE", 
                "repositoryArn": "arn:aws:ecr:us-east-1:738665750289:repository/docker-on-aws/nodejs", 
                "repositoryName": "docker-on-aws/nodejs", 
                "createdAt": 1601709048.0
            }
        }`
* Tag the image
    - docker tag docker-aws 738665750289.dkr.ecr.us-east-1.amazonaws.com/docker-aws/nodejs
    (docker tag docker-aws <ACCOUNT ID>.dkr.ecr.us-east-1.amazonaws.com/docker-aws/nodejs)
* Push the image to ECR    
    - docker push 738665750289.dkr.ecr.us-east-1.amazonaws.com/docker-aws/nodejs
    (docker push <ACCOUNT ID>.dkr.ecr.us-east-1.amazonaws.com/docker-aws/nodejs)

* Creating task execution role AWS
    - Go to the infrasstructure folder it has the file 'task-execution-assume-role.json' 
    - run the command 'aws iam create-role --role-name ecsTaskExecutionRole --assume-role-policy-document file://task-execution-assume-role.json'
    - Out put will be as follows
    `{
        "Role": {
            "AssumeRolePolicyDocument": {
                "Version": "2012-10-17", 
                "Statement": [
                    {
                        "Action": "sts:AssumeRole", 
                        "Principal": {
                            "Service": "ecs-tasks.amazonaws.com"
                        }, 
                        "Effect": "Allow", 
                        "Sid": ""
                    }
                ]
            }, 
            "RoleId": "AROA2X67I34IUWT2EF23L", 
            "CreateDate": "2020-10-03T07:19:11Z", 
            "RoleName": "ecsTaskExecutionRole", 
            "Path": "/", 
            "Arn": "arn:aws:iam::738665750289:role/ecsTaskExecutionRole"
        }
    }`
    - Take note of the "Arn" in the output.

* Attach the task execution role
 - Run 'aws iam attach-role-policy --role-name ecsTaskExecutionRole --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy'


* Take the "Arn" you copied earlier and paste it into the node-task-definition.json(in the infrastructure folder) file for the executionRoleArn

* in node-task-definition.json file has the 'image' field. Please change it with your account id
    - "image": "xxxxx.dkr.ecr.us-east-1.amazonaws.com/docker-on-aws/nodejs:latest"
        - xxxxx is your account id

* Registering ECS task definition        
    - Run (in infrastructe folder) 'aws ecs register-task-definition --cli-input-json file://node-task-definition.json'

* ECS service creation
    - Create the security group run `aws ec2 create-security-group --group-name ecs-security-group --description "SG us-east-1 ECS"`.
    - That will output a security group ID. Take note of this ID( As below)
    `{
        "GroupId": "sg-093139649d1b2a09b"
     }`

     - Need to add rule allow port 4000 for our node application. Run `aws ec2 authorize-security-group-ingress --group-id <YOUR SG ID> --protocol tcp --port 4000 --cidr 0.0.0.0/0 to add port 4000`

     - Now it is need to get public subnets for crete ECS service. Run 'aws ec2 describe-subnets'.
     Output you should see "SubnetArn" for all the subnets. At the end of that line you see "subnet-XXXXXX" take note of those subnets. Note: if you are in us-east-1 you should have 6 subnets

     - Replace the subnets and security group Id with yours and run `aws ecs create-service --cluster docker-aws --service-name nodejs-service --task-definition nodejs-fargate-task:1 --desired-count 1 --network-configuration "awsvpcConfiguration={subnets=[ subnet-XXXXXXXXXX, subnet-XXXXXXXXXX, subnet-XXXXXXXXXX, subnet-XXXXXXXXXX, subnet-XXXXXXXXXX, subnet-XXXXXXXXXX],securityGroups=[sg-XXXXXXXXXX],assignPublicIp=ENABLED}" --launch-type "FARGATE"`.

* View the application
    - To view the application you need to get the public ip.Go to ECS dashboard and click the the cluster you created.
    - Click the task tab and click your task id
    - In network section on there you will see the public ip
    - paste the public ip  ex - 'http://54.85.207.10:4000/'
    - Note : if you configured it with port 80 you dont need to define the port

## Improvements
    - Use the cloudformation template

## Note -
* As this does not have a much logic, I have not seperated the logic. app.js file have everything. But I have included the flow with controllers. For a example if you uncomment the line no 1,  44  
adn ran the application again, it will run the app with controller logic. Then  'http://localhost:4000/api/v1/echo' this endpoint can access.