# Barber Booking Sistem

Full-stack web aplikacija za online rezervaciju termina u salonima, ordinacijama i servisima.

## Demo

> Deploy coming soon

## Funkcionalnosti

### Klijentska strana
- Odabir usluge, datuma i termina
- Zauzeti termini automatski blokirani u realnom vremenu
- Email potvrda rezervacije
- Moderan tamni dizajn sa zlatnim detaljima

### Admin panel
- Pregled svih rezervacija u realnom vremenu
- Potvrda / otkazivanje / brisanje rezervacija
- Upravljanje uslugama (dodaj, uredi, obriši, aktiviraj)
- Automatske email notifikacije klijentima
- Live polling — bez potrebe za refreshanjem

## Tech Stack

**Frontend**
- Next.js 14 (App Router)
- Tailwind CSS
- React Hooks

**Backend**
- Node.js + Express
- PostgreSQL
- JWT autentifikacija
- Nodemailer (email notifikacije)

## Pokretanje lokalno

### Preduvjeti
- Node.js 18+
- PostgreSQL 16+

### Backend
```bash
cd backend
npm install
```

Kreiraj `.env` fajl:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=booking_db
DB_USER=postgres
DB_PASSWORD=tvoja_lozinka
JWT_SECRET=tajni_kljuc
EMAIL_USER=tvoj@gmail.com
EMAIL_PASS=app_password
```
```bash
npm run dev
```

### Baza podataka
```bash
psql -U postgres -d booking_db -f database/schema.sql
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Aplikacija dostupna na `http://localhost:3000`

## Autor

**zvone18200** — [GitHub](https://github.com/zvone18200) 
