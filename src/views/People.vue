<template>
  <v-container fluid>
    <v-row justify="center" align-content="stretch">
      <v-card>
        <v-card-title>
          <span class="headline">Coming Soon</span>
        </v-card-title>
        <v-card-text>
          <p>
            This <b>My People</b> page will manage how your friends and family
            can be safer together.
          </p>
        </v-card-text>

        <v-card-text
          >Your safety team has three dimensions:
          <ol>
            <li>You (plus Secours.io)</li>
            <li>Friends and family</li>
            <li>Dependents</li>
          </ol>
        </v-card-text>
        <v-card-text>
          You can expand your sphere of influence by:
          <ol>
            <li>Giving your community a unique name.</li>
            <li>
              Ask your friends and family to join you with an email
            </li>
            <li>
              Enrolling a dependent, and linking your Secours Member records
            </li>
          </ol>
        </v-card-text>
        <!-- <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog3 = true"
            >Create a community</v-btn
          >
          <v-btn color="green darken-1" text @click="dialog2 = false"
            >Close</v-btn
          >
        </v-card-actions> -->
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'people'
};
</script>
