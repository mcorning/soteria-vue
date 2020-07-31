# Soteria-vue

## Design

### Roles

Soteria-Vue works with two Roles. A human is behind both Roles.

1. Room
2. Visitor

The person behind the Room can change; they can be a Room manager (e.g., Care Home Manager) or a receptionist. Rooms are part of Organizations. Organizations are secure data repositories.

The Visitor is always the same person.

### Capabilities

Soteria-Vue has three levels of service (SLA):

1. Local Contact Tracing (requires no interaction with Room)
2. Symptom Tracking (with visual Risk Score) (enables limited interaction with Room)
3. Cryptographic (automated Room risk policy verification using personal and covid credentials)

## Workflow

We describe the steps each Role takes in making SLA1 work. These steps assume everybody has access to the Secure-Vue web application.

### Rooms

Each Room joins an Organization using a unique human-readable name. A record in the Connections store represents this Room room to Visitors. The Room manager/rep selects the Room Role in the Tracing screen. The Role list item has add and delete icons. To join an Organization, the Room selects the add icon and enters a human-friendly name. The app will ensure the name is unique to the Organization.

### Visitors

Visitors select the Visitor Role in the Tracing screen. There they see a list of rooms supporting Local Contact Tracing. The Visitor list item has add and delete icons. To join an Organization, the Visitor selects the add icon and enters a human-friendly name (usually the name of the person's phone). The app will ensure the name is unique to the Organization.

### Note

One reason for representing Roles in a list is that a single person can take on either Role. This is especially likely when Organizations have multiple Rooms. For example, a receptionist can take the Room Role during the day and then a Visitor Role at night when they go to a restaraunt. 

