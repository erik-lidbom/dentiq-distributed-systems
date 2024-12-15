<template>
  <div class="container py-5">
    <h1 class="text-center display-4 mb-5">Admin Dashboard</h1>

    <!-- Loading and Error States -->
    <div v-if="loading" class="text-center text-secondary">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="error" class="text-center text-danger">
      <p>{{ error }}</p>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Summary Section -->
      <div class="row mb-4">
        <div class="col-12 col-sm-6 col-lg-3 mb-3">
          <div class="card text-center shadow-sm border-0">
            <div class="card-body">
              <h5 class="card-title text-secondary">
                <i class="bi bi-calendar-check"></i> Total Appointments
              </h5>
              <p class="display-6 fw-bold text-dark">
                {{ stats.totalAppointments }}
              </p>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-3 mb-3">
          <div class="card text-center shadow-sm border-0">
            <div class="card-body">
              <h5 class="card-title text-secondary">
                <i class="bi bi-check-circle text-success"></i> Booked
              </h5>
              <p class="display-6 fw-bold text-success">
                {{ stats.bookedAppointments }}
              </p>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-3 mb-3">
          <div class="card text-center shadow-sm border-0">
            <div class="card-body">
              <h5 class="card-title text-secondary">
                <i class="bi bi-x-circle text-danger"></i> Cancelled
              </h5>
              <p class="display-6 fw-bold text-danger">
                {{ stats.cancelledAppointments }}
              </p>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-3 mb-3">
          <div class="card text-center shadow-sm border-0">
            <div class="card-body">
              <h5 class="card-title text-secondary">
                <i class="bi bi-clock-history text-warning"></i> Unbooked
              </h5>
              <p class="display-6 fw-bold text-warning">
                {{ stats.unbookedAppointments }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Appointments by Dentist -->
      <div class="card shadow-sm border-0 mb-4">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0">Appointments by Dentist</h5>
        </div>
        <div class="card-body">
          <ul class="list-group">
            <li
              v-for="dentist in stats.appointmentsByDentist"
              :key="dentist.dentistId"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              <span class="text-secondary"
                >Dentist ID: {{ dentist.dentistId }}</span
              >
              <span class="badge bg-info text-dark rounded-pill">
                {{ dentist.total }}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Popular Appointment Times -->
      <div class="card shadow-sm border-0">
        <div class="card-header bg-success text-white">
          <h5 class="mb-0">Popular Appointment Times</h5>
        </div>
        <div class="card-body">
          <ul class="list-group">
            <li
              v-for="time in stats.popularTimes"
              :key="time.start_time"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              <span class="text-secondary"
                >Time: {{ formatTime(time.start_time) }}</span
              >
              <span class="badge bg-primary text-white rounded-pill">
                {{ time.total }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      stats: {
        totalAppointments: 0,
        bookedAppointments: 0,
        cancelledAppointments: 0,
        unbookedAppointments: 0,
        appointmentsByDentist: [],
        popularTimes: []
      },
      loading: true,
      error: null
    }
  },
  mounted() {
    this.fetchStats()
  },
  methods: {
    async fetchStats() {
      try {
        const response = await axios.get('http://localhost:3002/')
        const appointments = response.data

        const totalAppointments = appointments.length
        const bookedAppointments = appointments.filter(
          (a) => a.status === 'booked'
        ).length
        const cancelledAppointments = appointments.filter(
          (a) => a.status === 'cancelled'
        ).length
        const unbookedAppointments = appointments.filter(
          (a) => a.status === 'unbooked'
        ).length

        const appointmentsByDentist = appointments.reduce((acc, curr) => {
          const dentist = acc.find((d) => d.dentistId === curr.dentistId)
          if (dentist) {
            dentist.total++
          } else {
            acc.push({ dentistId: curr.dentistId, total: 1 })
          }
          return acc
        }, [])

        const popularTimes = appointments.reduce((acc, curr) => {
          const timeSlot = acc.find((t) => t.start_time === curr.start_time)
          if (timeSlot) {
            timeSlot.total++
          } else {
            acc.push({ start_time: curr.start_time, total: 1 })
          }
          return acc
        }, [])

        this.stats = {
          totalAppointments,
          bookedAppointments,
          cancelledAppointments,
          unbookedAppointments,
          appointmentsByDentist,
          popularTimes
        }

        this.loading = false
      } catch (error) {
        this.error = 'Failed to fetch statistics. Please try again later.'
        console.error(error)
        this.loading = false
      }
    },
    formatTime(timestamp) {
      const date = new Date(Number(timestamp) * 1000)
      return date.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    }
  }
}
</script>

<style>
.error {
  color: red;
}
</style>
