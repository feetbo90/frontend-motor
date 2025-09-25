<template>
  <div class="backdrop">
    <div class="loader-box">
      <div class="loader">
        <p class="heading">Loading</p>
        <div class="loading">
          <div class="load"></div>
          <div class="load"></div>
          <div class="load"></div>
          <div class="load"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Backdrop */
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(30, 41, 59, 0.4); /* slate-800/40 */
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Loader Box */
.loader-box {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 260px;
}

/* Loading */
.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.heading {
  color: #222;
  letter-spacing: 0.2em;
  margin-bottom: 1em;
  font-weight: 600;
  font-size: 1.1rem;
}

.loading {
  display: flex;
  width: 5em;
  align-items: center;
  justify-content: center;
}

.load {
  width: 23px;
  height: 3px;
  background-color: limegreen;
  animation: 1s move_5011 infinite;
  border-radius: 5px;
  margin: 0.1em;
}

.load:nth-child(1) {
  animation-delay: 0.2s;
}
.load:nth-child(2) {
  animation-delay: 0.4s;
}
.load:nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes move_5011 {
  0% {
    width: 0.2em;
  }
  25% {
    width: 0.7em;
  }
  50% {
    width: 1.5em;
  }
  100% {
    width: 0.2em;
  }
}
/* End Loading */
</style>