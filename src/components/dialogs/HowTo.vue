<template>
  <v-list>
    <v-list-group
      v-for="item in items"
      :key="item.title"
      v-model="item.active"
      :prepend-icon="item.action"
      no-action
    >
      <template v-slot:activator>
        <v-list-item-content>
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item-content>
      </template>

      <v-list-item v-for="subItem in item.items" :key="subItem.title">
        <v-list-item-content>
          <v-list-item-action-text
            v-text="subItem.text"
          ></v-list-item-action-text>
        </v-list-item-content>
      </v-list-item>
    </v-list-group>
  </v-list>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          title: '1) Observe (Me)',
          items: [
            {
              text: 'Enter field values.'
            },
            {
              text:
                'If you manage a room, check the box and specify your risk tolerance (a tolerance of 1 accepts only healthy visitors up to 10 which will admit everybody).'
            }
          ]
        },
        {
          title: '2) Orient (PHI)',
          items: [
            {
              text:
                'Check your symptoms, as necessary. Your Me page will update your score automatically. '
            },
            {
              text:
                'Use the second form to convert Covid-19 test results to a Positive or Negative Covid-19 test credential. Assessing risk next is based on these credentials.'
            }
          ]
        },
        {
          title: '3) Decide (Risk)',
          items: [
            {
              text:
                'Room managers, present a QR code to your Visitor. Wait for Visitor to present credentials.'
            },
            {
              text:
                'Visitor, present a QR code to the Room. Wait for Room to provide its risk threshold.'
            },
            {
              text:
                'Once each has presented their credentials, each assess the proof results of the other.'
            }
          ]
        },
        {
          title: '4) Act (Tracing)',
          items: [
            {
              text:
                'If the Visitor wants to participate in Local Contact Tracing, they will exchange connection IDs with the Room.'
            },

            {
              text:
                'Later, if a Visitor get a Positive test or present symptoms with a Score > 6, then you should notify all the rooms you have been in for the last five days.'
            },

            {
              text:
                'If you manage a room and receive a notification from a previous occupant, warn the other Occupants that they may be exposed to the virus.'
            },
            {
              text:
                'If you manage a room you test positive or presents symptoms yourself, warn the other Occupants of your Room that they may be exposed to the virus.'
            }
          ]
        }
      ]
    };
  }
};
</script>
