
# Protocol Options

## Using connected credentials

| Step                                                             | Notes                                      | Offline ConnId?                  |
| ---------------------------------------------------------------- | ------------------------------------------ | -------------------------------- |
| 1. Approach room                                                 |
| 1. Visitor requests connected proof of exposure threshold        | Results tells visitor maximum risk of room | Visitor holds room connId        |
| 2. Room requests proof of exposure risk with conn                | Assumes Score is part of Personal Cred     | Room adds visitor connId to list |
| 3. If visitor is safe enough and room is safe enough, enter room |
| 4. Remove connections older than five days                       | Duration set by CDC                        |

## Using connections and messages

| Step | Notes | Offline ConnId? |
| ---- | ----- | --------------- |
1. Visitor sends message to connected room, "maximum risk level?"
2. Room | Policy uses safe zipcode and test results creds | Yes
3. Room sends welcome message to visitor's connectId | message includes room connectionId

## Local Contact Tracing

### You

1. Test Positive
2. To all stored connections, send exposure warning, "I am positive."

### Them

1. To all stored connections, send exposure warning, "You may have been exposed."
