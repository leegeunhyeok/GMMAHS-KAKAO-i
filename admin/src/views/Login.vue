<template>
  <div id="login">
    <div id="user-profile">
      <img src="@/assets/user.png">
      <div id="message">{{ message }}</div>
    </div>
    <form @submit.prevent="login">
      <div class="input-area">
        <input type="text" name="id" placeholder="Your ID" v-model="id" required>
      </div>
      <div class="input-area">
        <input type="password" name="password" placeholder="Password" v-model="password" required>
      </div>
      <div>
        <button class="button">Login</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      id: '',
      password: '',
      message: 'Sign in admin account',
      fade: null
    }
  },
  created () {
    this.$http.post('/auth').then(r => {
      if (r.data.auth) {
        this.$router.push({ name: 'home' })
      }
    }).catch(e => {
      // eslint-disable-next-line
      console.error(e)
    })
  },
  methods: {
    login () {
      this.$http.post('/login', {
        id: this.id,
        password: this.password
      }).then(r => {
        if (r.data.login) {
          this.$router.push({ name: 'home' })
        } else {
          this.setMessage('Check your ID or PASSWORD')
        }
      }).catch(e => {
        this.setMessage(e.message)
      })
    },
    setMessage (message) {
      const messageElement = document.getElementById('message')
      messageElement.style.opacity = 0.0
      clearTimeout(this.fade)
      this.fade = setTimeout(() => {
        this.message = message
        messageElement.style.opacity = 1.0
      }, 500)
    }
  }
}
</script>
<style lang="scss">
#login {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 360px;
  transform: translate(-50%, -55%);
  padding: 20px;
  color: #fff;

  #user-profile {
    img {
      width: 100px;
    }

    #message {
      font-size: 1.2rem;
      margin: 10px 0;
      transition: .4s;
    }
  }
}

@media screen and (max-width: 768px) {
  #login {
    width: 80%;

    #user-profile {
      img {
        width: 60px;
      }
    }
  }
}
</style>
