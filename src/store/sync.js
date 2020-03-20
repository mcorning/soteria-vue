import { refresh } from '@/components/Timeline';

// import L from '@/logger';

const plugin = store => {
  store.subscribe((mutation, state) => {
    switch (mutation.type) {
      case 'REHYDRATE':
        console.log('REHYDRATE inside sync.js', state.history);
        break;
      case 'b':
        // dispatch request
        break;
      default:
        refresh(state);
    }
  });
};

export default plugin;
