  const { createApp, ref } = Vue;
  createApp({
    setup() {
      const storedUsername = localStorage.getItem('username') || 'Guest';
      const username = ref(storedUsername);
      return {
        username,
      };
    }
  }).mount('body');