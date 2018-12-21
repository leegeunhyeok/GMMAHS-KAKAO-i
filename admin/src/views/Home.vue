<template>
  <div id="home">
    <transition name="fade" mode="in-out">
      <div id="loading" v-if="loading">
        <div id="icon"></div>
      </div>
    </transition>
    <div id="header">GMMAHS Kakao Admin</div><div class="panel col-pc-1 col-mb-1">
      <h3>Message test</h3>
      <div class="input-area">
        <input v-model.trim="userKey" placeholder="User key">
      </div>
      <div class="input-area">
        <input v-model.trim="message" @keydown.enter="sendMessage" placeholder="Message">
      </div>
      <div class="button-area">
        <button class="button" @click="sendMessage">Send</button>
      </div>
      <div id="message-area">
        <div v-for="(message, i) of messageList" :key="i" class="message">
          <div :class="message.type === 'user' ? 'user-message' : 'bot-message'">{{ message.content }} </div>
        </div>
      </div>
    </div>
    <div class="panel col-pc-2 col-mb-1">
      <h3>Menu usage</h3>
      <canvas id="chart"></canvas>
      <div class="button-area">
        <button>Update</button>
      </div>
    </div>
    <div class="panel col-pc-2 col-mb-1">
      <h3>Data management</h3>
      <div class="button-area">
        <button>Update Meal Data</button>
      </div>
      <div class="button-area">
        <button>Update Calendar Data</button>
      </div>
      <div class="button-area">
        <button>Update Timetable Data</button>
      </div>
      <div class="button-area">
        <button>Update Weather Data</button>
      </div>
      <div class="button-area">
        <button>Reset Statistics Data</button>
      </div>
    </div>
    <div class="panel col-pc-1 col-mb-1">
      <h3>Admin management</h3>
      <div class="button-area">
        <button>Logout</button>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js'

export default {
  name: 'home',
  data () {
    return {
      loading: true,
      userKey: '$test_user_key',
      message: '',
      messageList: [],
      chart: null,
      chartData: []
    }
  },
  created () {
    this.$http.post('/auth').then(r => {
      if (!r.data.auth) {
        this.$router.push({ name: 'login' })
      }
    }).catch(e => {
      // eslint-disable-next-line
      console.error(e)
      this.$router.push({ name: 'login' })
    })
  },
  mounted () {
    this.updateChartData().catch(e => {
      // eslint-disable-next-line
      console.error(e)
    }).finally(() => {
      this.loading = false
      this.drawChart()
    })
  },
  methods: {
    updateChartData () {
      return new Promise((resolve, reject) => {
        this.$http.get('/chart').then(r => {
          if (r.data) {
            this.chartData = r.data
          }
          resolve()
        }).catch(e => {
          this.chartData = [1, 1, 1, 1, 1, 1]
          reject(e)
        })
      })
    },
    drawChart () {
      const ctx = document.getElementById('chart').getContext('2d')
      this.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Meal', 'Timetable', 'Calendar', 'Weather', 'Bus', 'Other'],
          datasets: [{
            label: '# of Usage',
            data: this.chartData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(75, 192, 192, 0.5)',
              'rgba(153, 102, 255, 0.5)',
              'rgba(255, 159, 64, 0.5)'
            ],
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        responsive: true
      })
    },
    sendMessage () {
      if (!this.message) {
        return
      }
      const message = this.message
      this.message = ''

      this.appendMessage({
        type: 'user',
        content: message
      })

      this.$http.post('/message', {
        user_key: this.userKey,
        content: message
      }).then(result => {
        // eslint-disable-next-line
        console.log(result.data)
        this.appendMessage({
          type: 'bot',
          content: result.data.message.text
        })
      }).catch(e => {
        // eslint-disable-next-line
        console.error(e)
        this.appendMessage({
          type: 'bot',
          content: e.message
        })
      })
    },
    appendMessage (messageData) {
      this.messageList.push(messageData)
      setTimeout(() => {
        const messageArea = document.getElementById('message-area')
        messageArea.scrollTop = messageArea.scrollHeight
      }, 10)
    }
  }
}
</script>
<style lang="scss">

#loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);

  #icon {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background-color: #fff;
    animation: loading 1s alternate infinite;
  }
}

@keyframes loading {
  0% {
    width: 0px;
    height: 0px;
    opacity: 0.0;
  }

  100% {
    width: 60px;
    height: 60px;
    opacity: 1.0;
  }
}

#header {
  width: 100%;
  height: 60px;
  line-height: 60px;
  margin-bottom: 10px;
  box-shadow: rgba(0, 0, 0, 0.2);
  color: #fff;
}

.panel {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  padding: 20px;
  margin: 20px;
  color: #fff;
  box-sizing: border-box;
  float: left;

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

  .button-area {
    button {
      cursor: pointer;
      border: none;
      border-radius: 5px;
      outline: none;
      background-color: rgba(0, 0, 0, 0.1);
      padding: 5px 10px;
      color: #fff;
      font-size: 1.1rem;
      margin-top: 16px;
      transition: .2s;

      &:hover {
        background-color: rgba(0, 0, 0, 0.2);
      }
    }
  }

  #message-area {
    display: inline-block;
    padding: 20px;
    width: 40%;
    height: 300px;
    margin: auto;
    border-radius: 10px;
    margin-top: 20px;
    box-sizing: border-box;
    background-color: rgba(255, 255, 255, 0.3);
    overflow-y: auto;
    color: #2c3e50;

    @media screen and (max-width: 768px) {
      & {
        width: 86%;
      }
    }

    .message {
      display: inline-block;
      width: 100%;

      .user-message {
        border-radius: 5px;
        padding: 5px;
        float: right;
        text-align: right;
        background-color: rgba(255, 255, 255, 0.5);
      }

      .bot-message {
        border-radius: 5px;
        padding: 5px;
        float: left;
        text-align: left;
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  }
}

.col-pc-1 {
  width: calc(100% - 40px);
}

.col-pc-2 {
  width: calc(50% - 40px);
}

@media screen and (max-width: 768px) {
  .panel {
    margin: 10px;
  }

  .col-mb-1 {
    width: calc(100% - 20px);
  }
}
</style>
