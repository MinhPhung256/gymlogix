import axios from "axios";

const BASE_URL = 'http://192.168.88.108:8000/';

export const endpoints = {
  'login': '/o/token/', 
  'register': '/users/',

   // activity
'activity-list': '/activity/',
'activity-create': '/activity/',
'activity-read': (actId) => `/activity/${actId}/`,
'activity-update': (actId) => `/activity/${actId}/`,
'activity-partial-update': (actId) => `/activity/${actId}/`,
'activity-delete': (actId) => `/activity/${actId}/`,  

// chatmessage
'chatmessage-list': '/chatmessage/',
'chatmessage-create': '/chatmessage/',
'chatmessage-read': (chatId) => `/chatmessage/${chatId}/`,
'chatmessage-update': (chatId) => `/chatmessage/${chatId}/`,
'chatmessage-partial-update': (chatId) => `/chatmessage/${chatId}/`,
'chatmessage-delete': (chatId) => `/chatmessage/${chatId}/`,

// connection
'connection-list': '/connection/',
'connection-create': '/connection/',
'connection-read': (conId) => `/connection/${conId}/`,
'connection-update': (conId) => `/connection/${conId}/`,
'connection-partial-update': (conId) => `/connection/${conId}/`,
'connection-delete': (conId) => `/connection/${conId}/`,

// goal
'goal-list': '/goal/',
'goal-create': '/goal/',
'goal-read': (goalId) => `/goal/${goalId}/`,
'goal-update': (goalId) => `/goal/${goalId}/`,
'goal-partial-update': (goalId) => `/goal/${goalId}/`,
'goal-delete': (goalId) => `/goal/${goalId}/`,

// healthdiary
'healthdiary-list': '/healthdiary/',
'healthdiary-create': '/healthdiary/',
'healthdiary-read': (diaryId) => `/healthdiary/${diaryId}/`,
'healthdiary-update': (diaryId) => `/healthdiary/${diaryId}/`,
'healthdiary-partial-update': (diaryId) => `/healthdiary/${diaryId}/`,
'healthdiary-delete': (diaryId) => `/healthdiary/${diaryId}/`,
'healthdiary-my-diaries': '/healthdiary/my_diaries/',

// healthrecord
'healthrecord-list': '/healthrecord/',
'healthrecord-create': '/healthrecord/',


// user
'get-all-users': '/users/all-users/',
'change-password': '/users/change-password/',
'current-user': '/users/current/',
'read-user': (userId) => `/users/${userId}/`,
'update-user':`/users/update-info/`,

// workoutplan
'workoutplan-list': '/workoutplan/',
'workoutplan-create': '/workoutplan/',
'workoutplan-read': (planId) => `/workoutplan/${planId}/`,
'workoutplan-update': (planId) => `/workoutplan/${planId}/`,
'workoutplan-partial-update': (planId) => `/workoutplan/${planId}/`,
'workoutplan-delete': (planId) => `/workoutplan/${planId}/`,

// mealplan
'mealplan-list': '/mealplan/',
'mealplan-create': '/mealplan/',
'mealplan-create-mealplan': '/mealplan/create-meal-plan/',
'mealplan-read': (mealId) => `/mealplan/${mealId}/`,
'mealplan-update': (mealId) => `/mealplan/${mealId}/`,
'mealplan-partial-update': (mealId) => `/mealplan/${mealId}/`,
'mealplan-delete': (mealId) => `/mealplan/${mealId}/`,
};



export const createOrUpdateWorkoutPlan = (token, data) => {
  return axios.post(`${BASE_URL}/workoutplan/create-plan/`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

export const getMealPlansByGoal = (token, goal) => {
  return axios.get(`${BASE_URL}/mealplan/`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { goal }, // backend cần hỗ trợ filter bằng query param 'goal'
  });
};

export const changePassword = async (token, currentPassword, newPassword) => {
  try {
    const api = authApis(token);
    const res = await api.post(endpoints['change-password'], {
      old_password: currentPassword,
      new_password: newPassword
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi đổi mật khẩu:", error.response?.data || error.message);
    throw error;
  }
};


export const authApis = (token) => {
  return axios.create({
      baseURL: BASE_URL,
      headers: {
          'Authorization': `Bearer ${token}`
      }
  })
}


export default axios.create({
  baseURL: BASE_URL
});
