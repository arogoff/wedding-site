const API_BASE = "http://localhost:3000/api/rsvp";

export const API = {
  user: `${API_BASE}/user`,
  plusOne: {
    add: `${API_BASE}/plusone/add`,
    remove: `${API_BASE}/plusone/remove`,
    list: (inviterId: number) => `${API_BASE}/plusone/list?inviterId=${inviterId}`,
  },
  update: `${API_BASE}/update`,
};