<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<style lang="scss">
html, body {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}

#app {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(#739AD9, #96C6E7, #7FC6CE, #80CECB);
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow-y: auto;
}

.input-area {
  input {
    background-color: rgba(0, 0, 0, 0.1);
    outline: none;
    border: none;
    border-radius: 20px;
    transition: .2s;
    padding: 10px 20px;
    margin-top: 10px;
    text-align: center;
    color: #fff;

    &:hover {
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
}

.button {
  cursor: pointer;
  border: none;
  outline: none;
  background-color: transparent;
  padding: 5px;
  color: #fff;
  font-size: 1.1rem;
  margin-top: 16px;

  &:hover {
    color: rgba(255, 255, 255, 0.6);
  }
}

::placeholder {
  color: rgba(255, 255, 255, 0.6);
  opacity: 1;
}

:-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.6);
}

::-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s ease;
}

.fade-enter, .fade-leave-to  {
  opacity: 0;
}
</style>
