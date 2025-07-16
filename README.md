# Baigiamasis projektas - Travel Agency

Tai Node.js + Express + MongoDB pagrindu sukurta API, skirta kelionių rezervacijos platformai. Užtikrina vartotojų autentifikaciją, produktų (krypčių, viešbučių, agentūrų) valdymą, užsakymų apdorojimą, atsiliepimų sistemą ir vaidmenų kontrolę.

---

## 🚀 Paleidimas

### 1. Klonuok repozitoriją
```bash
git clone https://github.com/Viktorija-Sta/TravelAgency-BE
cd TravelAgency-BE
```

### 2. Įdiek priklausomybes
``` bash
npm install
# or
yarn 
```

### 3. Sukurk .env failą
``` env
PORT=3000
MONGO_URL=<your-mongodb-connection-string>
JWT_SECRET=<super_secret_key>
CLIENT_URL=http://localhost:5173
```
⚠️ Pritaikyk MONGO_URL ir CLIENT_URL pagal savo aplinką.

### 4. Paleisk serverį
``` bash
npm run dev
```

API pasiekiamas per: http://localhost:2000/api


## ⚙️ Naudotos technologijos
- Node.js + Express (serveris)

- MongoDB + Mongoose (duomenų bazė)

- JWT autentifikacija

- bcryptjs (slaptažodžių šifravimui)

- dotenv (konfigūracija per .env)

- CORS (leidžiama frontend sąveika)

- Role-based Access Control (RBAC) – Admin, User, Author


## 🔐 API Autentifikacija
- Registracija ir prisijungimas su slaptažodžio šifravimu (bcrypt)

- JWT tokenai naudojami Authorization: Bearer <token> formatu

- Apsaugoti maršrutai pasiekiami tik prisijungus


## 🌍 Susijęs projektas
Frontend projektas:
🔗 [TravelAgency-FE (React + Vite + TypeScript)](https://github.com/Viktorija-Sta/TravelAgency-FE)


## 📝 Pastabos
- Duomenų modeliai susieti (pvz., viešbučiai priskirti kryptims, užsakymai turi kelis produktus).

- Aiškiai atskirta vartotojo rolė (USER, ADMIN) leidžia saugiai valdyti prieigą prie skirtingų funkcijų.

- Paruošta API plėtrai (pvz., papildomų produktų tipai, užsakymų būsenos).

