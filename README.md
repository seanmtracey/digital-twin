# The Digital Twin Creator
This piece of software allows people to draw digital twins of physical systems and then have them respond to events dispatched by an MQTT broker.

# IBM Cloud Deployment

## Requirements

**You will need:**

- An IBM Cloud account
- A Cloud Object Storage instance
- A Cloudant Database instance
- The IBM Cloud CLI

This application will be deployed as an Cloud Foundry application.

## Instructions for deployment

## Creating Required Services

### Creating + Configuring a Cloud Object Storage Instance

1. Log in to your IBM Cloud account. You'll be taken to your account dashboard
2. At the top right of the screen click the "Create Resource" button
3. On the products page, search for "Object Storage" amd click the card that appears in the result.
4. Choose a pricing tier that suits you for the new Object Storage instance, give it a memorable name and then click the "Create" button

### Creating + Configuring a Cloudant Database Instance

1. Log in to your IBM Cloud account. You'll be taken to your account dashboard
2. At the top right of the screen click the "Create Resource" button
3. On the products page, search for "Cloudant" amd click the card that appears in the result.
4. Choose a pricing tier that suits you for the new Object Storage instance, give it a memorable name and then click the "Create" button.

## Deploying the Digital Twin Software.

1. Clone this repository
2. `cd` into the newly created folder containing the code for this repo
3. Enter the command `ibmcloud cf push`. This will create a new public Cloud Foundry application to run this software. After the first attempt it will fail, but this is fine.
4. Follow the *Environment Variables* section of this document and then repeat these steps.

## Environment Variables

In order for this software to run successfully and as designed, certain environment variables are required to be set on the application server. At a minimum, they are as follows:

- DEFAULT_DB_NAME
    - The name of the Cloudant database that the Digital Twin software will use store information about the Digital Twins.
- NODE_ENV
    - "production" will run the Digital Twin software using `w3id-middleware` software package for authentication of users using IBM SSO authentication. This is no longer recommended as I wrote that software and it is no longer supported
    - "development" will override the `w3id-middleware` package and use the TEST_USER variable to enable local development
- TEST_USER
    - A user UUID/STRING that will be used as the test user in the event that the application is being run in "development" mode (see NODE_ENV).
- DATABASE_API_KEY
    - An API key to access the Cloudant database you will have set up for running with the Digital Twin Software. You can generate this by navigating to the "Service Credentials" section of the Cloudant Database dashboard you will have been taken to after the creation of the instance.
- DATABASE_ENDPOINT
    - Also generated when you create the DATABASE_API_KEY. It is the value assigned to the key "host" prepended with `https://`
- COS_ENDPOINT
    - The endpoint will vary depending on the settings of the object storage creation. You can find a list of endpoints under the "Endpoints" tab of the Object Storage instance you created.
- COS_ACCESS_KEY_ID
    - Paired with *COS_ACCESS_KEY_SECRET*. You can generate both of these by heading to the "Service Credentials" tab of your COS instance, clicking "New Credential" and then toggling "Include HMAC Credential" under "Advanced Options".
- COS_ACCESS_KEY_SECRET
    - See COS_ACCESS_KEY_ID
- COS_REGION
    - The region that you COS instance is accessible through - likely `eu-gb`
- COS_DEFAULT_BUCKET
    - The name of the bucket that you created for us with the Digital Twin software.