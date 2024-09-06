export const apiUrl = "http://192.168.1.207:9020/";
export const getToken = localStorage.getItem('token');
export const getRole = localStorage.getItem('Role');
export const getUserId = localStorage.getItem('UserID');
export const getUserName = localStorage.getItem('UserName');
export const getEmail = localStorage.getItem('Email');
export const CoCode = localStorage.getItem('CoCode');

export const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
  };

export const generateMonths = [
  { id: 1, name: "Januari" },
  { id: 2, name: "Februari" },
  { id: 3, name: "Maret" },
  { id: 4, name: "April" },
  { id: 5, name: "Mei" },
  { id: 6, name: "Juni" },
  { id: 7, name: "Juli" },
  { id: 8, name: "Agustus" },
  { id: 9, name: "September" },
  { id: 10, name: "Oktober" },
  { id: 11, name: "November" },
  { id: 12, name: "Desember" }
];

export const generateCategory = [
  { id: "ALL", name: "All"},
  { id: "KAT1", name: "Kategori 1"},
  { id: "KAT2", name: "Kategori 2"}
]