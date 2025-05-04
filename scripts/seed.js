require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const User = require('../models/userModel')
const Hotel = require('../models/hotelModel')
const Destination = require('../models/destinationModel')
const Category = require('../models/categoryModel')
const Agency = require('../models/agencyModel')
const Review = require('../models/reviewModel')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)
    console.log('✅ MongoDB connected')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}

const seedData = async () => {
  try {
    await connectDB()

    console.log('⛔ Trinami esami duomenys...')
    await Promise.all([
      User.deleteMany(),
      Hotel.deleteMany(),
      Destination.deleteMany(),
      Category.deleteMany(),
      Agency.deleteMany(),
      Review.deleteMany()
    ])

    console.log('📦 Kuriami vartotojai...')
    const hashedPassword = await bcrypt.hash('password123', 10)
    const users = await User.insertMany([
      { username: 'admin', email: 'admin@admin.com', password: hashedPassword, role: 'admin', phoneNumber: '+37060000001',
        address: 'London', profilePicture: 'https://i.redd.it/instagram-default-user-profile-pic-flip-flops-v0-clnilflfeg4d1.jpg?width=230&format=pjpg&auto=webp&s=e5c920f218f52a77c28abc5175c8db29dfa0d219' },
      { username: 'john', email: 'john@example.com', password: hashedPassword, role: 'user', phoneNumber: '+37060000003',
        address: 'Vilnius', profilePicture: 'https://i.redd.it/instagram-default-user-profile-pic-flip-flops-v0-clnilflfeg4d1.jpg?width=230&format=pjpg&auto=webp&s=e5c920f218f52a77c28abc5175c8db29dfa0d219' },
      { username: 'sara', email: 'sara@example.com', password: hashedPassword, role: 'user', phoneNumber: '+37060000002',
        address: 'Paris', profilePicture: 'https://i.redd.it/instagram-default-user-profile-pic-flip-flops-v0-clnilflfeg4d1.jpg?width=230&format=pjpg&auto=webp&s=e5c920f218f52a77c28abc5175c8db29dfa0d219' },
      { username: 'mike', email: 'mike@gmail.com', password: hashedPassword, role: 'user', phoneNumber: '+37060000004',
        address: 'Kaunas', profilePicture: 'https://i.redd.it/instagram-default-user-profile-pic-flip-flops-v0-clnilflfeg4d1.jpg?width=230&format=pjpg&auto=webp&s=e5c920f218f52a77c28abc5175c8db29dfa0d219' },
      { username: 'anna', email: 'anna@ana.com', password: hashedPassword, role: 'user', phoneNumber: '+37060000005',
        address: 'Berlin', profilePicture: 'https://i.redd.it/instagram-default-user-profile-pic-flip-flops-v0-clnilflfeg4d1.jpg?width=230&format=pjpg&auto=webp&s=e5c920f218f52a77c28abc5175c8db29dfa0d219' }
    ])

    console.log('📦 Kuriamos kategorijos...')
    const categories = await Category.insertMany([
      { name: 'Pažintinės', description: 'Exciting outdoor trips' },
      { name: 'Poilsinės', description: 'Peaceful and calm holidays' },
      { name: 'Ekstremalios', description: 'Extreme adventures' },
      { name: 'Kultūrinės', description: 'Cultural experiences' },
      { name: 'Gastronominės', description: 'Culinary delights' }

    ])

    console.log('📦 Kuriamos agentūros...')
    
    const agencies = await Agency.insertMany([
      {
        name: 'TravelPro',
        description: 'Individualiai pritaikytos kelionės',
        fullDescription: '„TravelPro“ – tai pirmaujanti kelionių agentūra, kuri specializuojasi individualiai pritaikytose kelionėse. Mūsų ekspertų komanda pasirūpins viskuo – nuo skrydžių ir viešbučių iki individualių maršrutų. Keliaukite be rūpesčių ir kurkite prisiminimus visam gyvenimui.',
        location: 'Vilnius',
        contactInfo: { email: 'contact@travelpro.lt', phone: '+37060012345' },
        website: 'https://www.travelopro.com/',
        establishedYear: 2005,
        logo: 'https://img.freepik.com/premium-vector/free-vector-black-white-vintage-illustrative-travel-agent-logo_883906-2467.jpg'
      },
      {
        name: 'Makalius',
        description: 'Biudžetinės kelionės',
        fullDescription: '„Makalius“ – tai Jūsų pasirinkimas, jei ieškote prieinamų, bet nepamirštamų kelionių. Mes siūlome biudžetui draugiškus pasiūlymus savaitgalio išvykoms, pažintinėms kelionėms ir poilsiui, o mūsų konsultantai padės rasti geriausią variantą.',
        location: 'Kaunas',
        contactInfo: { email: 'info@nakalius.lt', phone: '+37061198765' },
        website: 'https://www.makalius.lt/',
        establishedYear: 2010,
        logo: 'https://img.freepik.com/premium-vector/free-vector-black-white-vintage-illustrative-travel-agent-logo_883906-2467.jpg'
      },
      {
        name: 'TezTour',
        description: 'Ekstremalūs nuotykiai',
        fullDescription: '„TezTour“ – tai agentūra, orientuota į nuotykių ištroškusius keliautojus. Siūlome parašiutų šuolius, šuolius su virve, kalnų žygius ir kitas aktyvias veiklas visame pasaulyje. Su mumis Jūsų adrenalino lygis tikrai pakils!',
        location: 'Klaipėda',
        contactInfo: { email: 'adventure@teztour.com', phone: '+37061234567' },
        website: 'https://www.teztour.lt/',
        establishedYear: 2012,
        logo: 'https://img.freepik.com/premium-vector/free-vector-black-white-vintage-illustrative-travel-agent-logo_883906-2467.jpg'
      },
      {
        name: 'CulturalJourneys',
        description: 'Pažintinės kelionės po kultūras',
        fullDescription: '„CulturalJourneys“ siūlo unikalius kultūrinius potyrius. Jei Jus domina muziejai, architektūra, istoriniai miestai ir vietinių tradicijų pažinimas – ši agentūra kaip tik Jums. Atraskite pasaulio įvairovę su gidu, kuris įkvepia.',
        location: 'Šiauliai',
        contactInfo: { email: 'culturalJourneys@gmail.com', phone: '+37061345678' },
        website: 'https://www.culturaljourneys.lt',
        establishedYear: 2008,
        logo: 'https://img.freepik.com/premium-vector/free-vector-black-white-vintage-illustrative-travel-agent-logo_883906-2467.jpg'
      },
      {
        name: 'InterluxTravel',
        description: 'Kulinarinės kelionės',
        fullDescription: '„InterluxTravel“ kviečia patirti pasaulį per skonį. Ragausite vietinius patiekalus, lankysite žymiausius restoranus, dalyvausite kulinariniuose turuose ir netgi maisto gaminimo pamokose. Tobulas pasirinkimas tikriems gurmanams.',
        location: 'Panevėžys',
        contactInfo: { email: 'gourmet-travel@gourmet.com', phone: '+37061456789' },
        website: 'https://interluxtravel.lt/',
        establishedYear: 2016,
        logo: 'https://img.freepik.com/premium-vector/free-vector-black-white-vintage-illustrative-travel-agent-logo_883906-2467.jpg'
      }     
    ])

    console.log('📦 Kuriamos kelionės (destinations)...')
    const destinations = await Destination.insertMany([
      {
        name: 'Bali',
        description: 'Egzotiška sala su balto smėlio paplūdimiais ir nuostabiais saulėlydžiais.',
        fullDescription: 'Bali - tai Indonezijos sala, kuri garsėja savo balto smėlio paplūdimiais, nuostabiais saulėlydžiais, turkiškai mėlynais vandenimis, egzotiška gamta, kultūra ir tradicijomis. Tai viena iš populiariausių atostogų vietų pasaulyje, kurioje galima mėgautis atostogomis visiems skoniams. Balio paplūdimiuose galima mėgautis saule, jūra, bangomis, vandens sportais, masažais, spa procedūromis, egzotišku maistu',
        price: 1200,
        location: 'Indonesia',
        imageUrl: 'https://balidave.com/wp-content/uploads/2022/11/best-hotel-bali.jpeg',
        gallery: ['https://kelioniuakademija.lt/img/countries_head_pic_mobile/keliones_i_bali_2.jpg', 'https://media-cdn.tripadvisor.com/media/photo-m/1280/2a/c7/90/94/caption.jpg',"https://cdn.audleytravel.com/2478/1770/79/16027396-pura-ulun-danu-bratan-bali.jpg", "https://media.digitalnomads.world/wp-content/uploads/2021/01/20120709/bali-for-digital-nomads-1024x683.jpg", "https://lp-cms-production.imgix.net/2023-01/GettyImages-827446284.jpg?w=1095&fit=crop&crop=faces%2Cedges&auto=format&q=75"],
        category: categories[1]._id,
        agency: agencies[1]._id,
        departureDate: '2025-06-01',
        duration: 7,
      },
      {
        name: 'Iceland',
        description: 'Unikalus kraštovaizdis su ledynais ir vulkanais.',
        fullDescription: 'Iceland - tai unikalus kraštovaizdis su ledynais, vulkanais, geizeriais, karštomis versmėmis, kriokliais ir nuostabiais gamtos peizažais. Tai viena iš populiariausių kelionių vietų pasaulyje, kurioje galima mėgautis nuostabiais gamtos vaizdais, žygiais po kalnus, slidinėjimu, maudynėmis karštose versmėse ir daugybe kitų veiklų. Islandijoje taip pat galima pamatyti šiaurės pašvaistę, kuri yra viena iš gražiausių gamtos stebuklų.',
        price: 1900,
        location: 'Iceland',
        imageUrl: 'https://cdn.britannica.com/06/171306-050-C88DD752/Aurora-borealis-peninsula-Snaefellsnes-Iceland-March-2013.jpg',
        gallery: ['https://res.cloudinary.com/enchanting/q_70,f_auto,c_lfill,g_auto/exodus-web/2021/12/kirkjufellsfoss_iceland.jpg', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSadcyoCFiDTMadRrLH9p61OzTyC20hw2k9Iw&s', 'https://cdn.britannica.com/71/73371-050-9DFAEC1E/Reykjavik-Iceland.jpg', 'https://www.odysseys-unlimited.com/wp-content/uploads/2023/05/AdobeStock_329668972-scaled.jpeg' ],
        category: categories[0]._id,
        agency: agencies[0]._id,
        departureDate: '2025-07-01',
        duration: 10,
      },
      {
        name: 'Paris',
        description: 'Romantiškas miestas su garsiais lankytinais objektais, tokiais kaip Eifelio bokštas ir Luvras.',
        fullDescription: 'Paryžius - vienas iš romantiškiausių miestų pasaulyje, kuris garsėja savo garsiais lankytinais objektais, tokiais kaip Eifelio bokštas, Luvras, Notr Damo katedra, Triumfo arka, Montmartro kalnas, Sena miesto gatvės ir aikštės bei daugybė kitų. Tai vienas iš tų miestų, kuriuos reikia pamatyti bent kartą gyvenime. Paryžiuje galima mėgautis prancūzišku maistu, vynu, ledais, kava, aukščiausios kokybės gelatu, o vakarais - pasivaikščioti po miesto gatves, kuriomis sklando romantiška atmosfera.',
        price: 1500,
        location: 'France',
        imageUrl: 'https://img.static-af.com/transform/45cb9a13-b167-4842-8ea8-05d0cc7a4d04/',
        gallery: ['https://ma.visamiddleeast.com/dam/VCOM/regional/cemea/generic-cemea/travel-with-visa/destinations/paris/marquee-travel-paris-800x450.jpg', 'https://a.storyblok.com/f/239725/4096x2731/9eacb27b6d/hero-paris.jpg/m/3840x2560', 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/aa/20/d1/the-louvre-originally.jpg?w=1200&h=700&s=1', 'https://pullman.accor.com/destinations/city/paris-1400x788-3.jpg' ],
        category: categories[3]._id,
        agency: agencies[3]._id,
        departureDate: '2025-08-01',
        duration: 5,
      },
      {
        name: 'Tokyo',
        description: 'Modernus miestas su aukščiausiais dangoraižiais ir tradicinėmis šventėmis.',
        fullDescription: 'akoma, kad nuvykus į Japoniją galima pasijusti tarsi atsidūrus kitoje planetoje – nesuprantama kalba ir užrašai, svaiginantys megapoliai, kuriuos keičia ramybe dvelkiantys kaimai ir nuostabi gamta su legendiniu Fudžio kalnu, tikras japoniškas maistas, arbata, tradiciniai ritualai ir daugybė kitų patirčių, kurių tikėtis galima tik Tekančios saulės šalyje ir niekur daugiau. Visa tai atrodo dar gražiau ir autentiškau pavasarį – sakurų žydėjimo metu. Tai ypatingas laikotarpis, kai visi japonai išeina į gatves, parkus ir sodus, kad pasimėgautų šio žydėjimo grožiu. Tai ypatingas laikotarpis, kai visi japonai išeina į gatves, parkus ir sodus, kad pasimėgautų šio žydėjimo grožiu.',
        price: 2000,
        location: 'Japan',
        imageUrl: 'https://res.cloudinary.com/aenetworks/image/upload/c_fill,ar_2,w_3840,h_1920,g_auto/dpr_auto/f_auto/q_auto:eco/v1/gettyimages-1390815938?_a=BAVAZGDX0',
        gallery: ['https://cdn5.travelconline.com/images/fit-in/2000x0/filters:quality(75):strip_metadata():format(webp)/https%3A%2F%2Ftr2storage.blob.core.windows.net%2Fimagenes%2FK3JpqxcG9OIw-5BresIITLnjpeg.jpeg', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPYyyy92DfnVa7FBSUzNeReJoDn8KREBlsjw&s', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Kabukicho_red_gate_and_colorful_neon_street_signs_at_night%2C_Shinjuku%2C_Tokyo%2C_Japan.jpg/330px-Kabukicho_red_gate_and_colorful_neon_street_signs_at_night%2C_Shinjuku%2C_Tokyo%2C_Japan.jpg', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnLyB790x2xaq6gRoUvybyyQasC7RnVACmIA&s'],
        category: categories[4]._id,
        agency: agencies[4]._id,
        departureDate: '2025-09-01',
        duration: 7,
      },
      {
        name: 'New York',
        description: 'Didžiausias JAV miestas, kuriame galima pamatyti laisvės statulą ir pasivaikščioti Central Park',
        fullDescription: 'iujorkas - didžiausias JAV miestas, kuriame galima pamatyti laisvės statulą, pasivaikščioti Central Park, aplankyti Niujorko muziejų, Niujorko operą, Niujorko prekybos centrą, Niujorko botanikos sodą, Niujorko zoologijos sodą, Niujorko planetariumą, Niujorko meno muziejų, Niujorko istorijos muziejų, Niujorko šiuolaikinio meno muziejų, Niujorko kinematografijos muziejų, Niujorko dizaino muziejų, Niujorko fotografijos muziejų, Niujorko vaikų muziejų, Niujorko mokslinio mokymo muziejų, Niujorko technologijų muziejų, Niujorko žydų muziejų, Niujorko karo muziejų, Niujorko karo oro laivyno muziejų, Niujorko karo jūrų muziejų, Niujorko karo laivų muziejų, Niujorko karo aviacijos muziejų, Niujorko karo istorijos muziejų, Niujorko karo laivų muziejų, Niujorko karo oro laivyno muziejų, Niujorko karo jūrų muziejų, Niujorko karo laivų muziejų, Niujorko karo aviacijos muziejų, Niujorko karo istorijos muziejų, Niujorko karo laivų muziejų, Niujorko karo oro laivyno muziejų, Niujorko karo jūrų muziejų ir daugybė kitų. Niujorke taip pat galima mėgautis amerikietišku maistu, vynu, ledais, kava, aukščiausios kokybės gelatu, o vakarais - pasivaikščioti po miesto gatves, kuriomis sklando romantiška atmosfera.',
        price: 2500,
        location: 'USA',
        imageUrl: 'https://cdn.britannica.com/61/93061-050-99147DCE/Statue-of-Liberty-Island-New-York-Bay.jpg',
        gallery: ['https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/960px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg', 'https://media.cntraveller.com/photos/64f4fc5f663208f83a21af16/4:3/w_2668,h_2001,c_limit/New%20York%20City_GettyImages-1347979016.jpg', 'https://media.gq-magazine.co.uk/photos/5d13a9c2976fa37177f3b040/16:9/w_2560%2Cc_limit/hp-gq-6dec18_istock_.jpg', 'https://assets.simpleviewinc.com/simpleview/image/upload/c_fill,h_474,q_75,w_640/v1/clients/newyorkstate/5232359e_e163_475c_abe3_0f20af112a8c_ae020bfc-a771-4564-87b7-479fbe55735d.jpg'],
        category: categories[2]._id,
        agency: agencies[2]._id,
        departureDate: '2025-10-01',
        duration: 10,
      },
      {
        name: 'Rome',
        description: 'Miestas, kuriame galima pamatyti senovinius pastatus, tokius kaip Koliziejus ir Fontanas di Trevi.',
        fullDescription: 'Roma - vienas iš seniausių ir įspūdingiausių Europos miestų, kuris garsėja savo istorija, kultūra, architektūra ir virtuve. Tai vienas iš tų miestų, kuriuos reikia pamatyti bent kartą gyvenime. Romoje galima pamatyti daugybę senovinių pastatų, tokių kaip Koliziejus, Forumas, Pantheonas, Fontanas di Trevi, Ispanų laiptai, Vatikano muziejus, Šventapilis, Panteonas, Romos forumas, Kapitolijus ir daugybė kitų. Romoje taip pat galima mėgautis itališku maistu, vynu, ledais, kava, aukščiausios kokybės gelatu, o vakarais - pasivaikščioti po miesto gatves, kuriomis sklando romantiška atmosfera.',
        price: 1800,
        location: 'Italy',
        imageUrl: 'https://lp-cms-production.imgix.net/2024-07/AdobeStock40207802.jpeg',
        gallery: ['https://i.natgeofe.com/k/a6c9f195-de20-445d-9d36-745ef56042c5/OG_Colosseum_Ancient-Rome_KIDS_1122_3x2.jpg', 'https://d1c96a4wcgziwl.cloudfront.net/hd_e00froma.jpg', 'https://cdn.audleytravel.com/4008/2863/79/1018521-rome-skyline-italy.jpg', 'https://i0.wp.com/www.touristitaly.com/wp-content/uploads/2023/03/Trevi-Fountain-rome-2-scaled.jpg?fit=4272%2C2848&ssl=1'],
        category: categories[3]._id,
        agency: agencies[3]._id,
        departureDate: '2025-11-01',
        duration: 4,
      },
      {
        name: 'Sydney',
        description: 'Didžiausias Australijos miestas, garsėjantis savo Opera House ir gražiais paplūdimiais.',
        fullDescription: 'Sidnėjus - didžiausias Australijos miestas, garsėjantis savo Opera House, gražiais paplūdimiais, nuostabiais parkais, muziejais, galerijomis ir daugybe kitų lankytinų vietų. Tai vienas iš tų miestų, kuriuos reikia pamatyti bent kartą gyvenime. Sidnėjuje galima mėgautis australietišku maistu, vynu, ledais, kava, aukščiausios kokybės gelatu, o vakarais - pasivaikščioti po miesto gatves, kuriomis sklando romantiška atmosfera.',
        price: 2200,
        location: 'Australia',
        imageUrl: 'https://www.pelago.com/img/destinations/sydney/hero-image.jpg',
        gallery: ['https://static.independent.co.uk/2024/03/20/17/newFile.jpg', 'https://cdn.sanity.io/images/faycjvmy/production/d32e248f7d205ff2a68f53c985b9ea3a270b44e4-3500x2334.jpg', 'https://lp-cms-production.imgix.net/2024-10/shutterstock1155837430.jpg?auto=compress&format=auto&fit=crop&q=50&w=1200&h=800', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXY--xys8BSY_NXRd4IFJEKyIBA6CRd3cSUA&s'],
        category: categories[4]._id,
        agency: agencies[4]._id,
        departureDate: '2025-12-01',
        duration: 8,
      }
    ])

    console.log('📦 Kuriami viešbučiai...')
    await Hotel.insertMany([
      {
        name: 'Ocean View Resort',
        location: 'Bali',
        description: 'Beachfront hotel with pools',
        pricePerNight: 90,
        amenities: ['WiFi', 'Breakfast', 'Pool'],
        category: categories[1]._id,
        agency: agencies[1]._id,
        destination: destinations[0]._id,
        image: 'https://media.istockphoto.com/id/119926339/photo/resort-swimming-pool.jpg?s=612x612&w=0&k=20&c=9QtwJC2boq3GFHaeDsKytF4-CavYKQuy1jBD2IRfYKc=',
        gallery:[
          'https://media.istockphoto.com/id/119926339/photo/resort-swimming-pool.jpg?s=612x612&w=0&k=20&c=9QtwJC2boq3GFHaeDsKytF4-CavYKQuy1jBD2IRfYKc=', 'https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG90ZWx8ZW58MHx8MHx8fDA%3D', 'https://www.usatoday.com/gcdn/-mm-/05b227ad5b8ad4e9dcb53af4f31d7fbdb7fa901b/c=0-64-2119-1259/local/-/media/USATODAY/USATODAY/2014/08/13/1407953244000-177513283.jpg'
        ]
      },
      {
        name: 'Glacier Inn',
        location: 'Reykjavik',
        description: 'Cozy hotel in Iceland capital',
        pricePerNight: 130,
        amenities: ['WiFi', 'Sauna'],
        category: categories[0]._id,
        agency: agencies[0]._id,
        destination: destinations[1]._id,
        image: 'https://plus.unsplash.com/premium_photo-1661964402307-02267d1423f5?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG90ZWwlMjByb29tfGVufDB8fDB8fHww',
        gallery: [
          'https://plus.unsplash.com/premium_photo-1661964402307-02267d1423f5?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG90ZWwlMjByb29tfGVufDB8fDB8fHww', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMUMQeZ-SsvgpqYcXLwp2JhAXmGsLxbp7_1w&s', 'https://media.istockphoto.com/id/1448506100/photo/male-hotel-receptionist-assisting-female-guest.jpg?s=612x612&w=0&k=20&c=xXJn95XgzSA4_LgGczr7ce-FnpcWXwYIr-fGH9yN_z0='
        ]
      },
      {
        name: 'Parisian Charm Hotel',
        location: 'Paris',
        description: 'Charming hotel in the heart of Paris',
        pricePerNight: 150,
        amenities: ['WiFi', 'Breakfast'],
        category: categories[3]._id,
        agency: agencies[3]._id,
        destination: destinations[2]._id,
        image: 'https://www.hotelscombined.com/himg/5b/cc/8b/ice-100053252-0746998_3XL-452362.jpg',
        gallery: [
          'https://www.hotelscombined.com/himg/5b/cc/8b/ice-100053252-0746998_3XL-452362.jpg', 'https://secure.s.forbestravelguide.com/img/properties/shangri-la-hotel-paris/shangri-la-hotel-paris-LAppartement-Prince%20Bonaparte.jpg', 'https://www.cordelia-paris-hotel.com/images_hotel_cordelia_paris/home/hotel-cordelia-paris-1.jpg'
        ]
      },
      {
        name: 'Tokyo Tower Hotel',
        location: 'Tokyo',
        description: 'Modern hotel with city views',
        pricePerNight: 200,
        amenities: ['WiFi', 'Gym'],
        category: categories[4]._id,
        agency: agencies[4]._id,
        destination: destinations[3]._id,
        image:  'https://en.palacehoteltokyo.com/wp-content/uploads/Palace-Hotel-Tokyo-Premium-Suite-Living-Room-Overlaid-1300x640-1-640x470.jpg',
        gallery: [
          'https://en.palacehoteltokyo.com/wp-content/uploads/Palace-Hotel-Tokyo-Premium-Suite-Living-Room-Overlaid-1300x640-1-640x470.jpg', 'https://www.travelandleisure.com/thmb/GdlE0YLt16NZMDRBz-TGvw5Xfbc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/TAL-bulgari-hotel-tokyo-pool-BLUGARITOKYO0423-12119235a51a4328a816930ede8baf33.jpg', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIBDN2aDqUzcyzp-RqljcXxCBy7hi6bKSEOg&s', 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/500956610.jpg?k=893ce269de9a881e635e48f42598395fd783a6da56a2fd83894f286cd5720766&o=&hp=1'
        ]
      },
      {
        name: 'New York Skyline Hotel',
        location: 'New York',
        description: 'Luxury hotel with skyline views',
        pricePerNight: 300,
        amenities: ['WiFi', 'Pool', 'Spa'],
        category: categories[2]._id,
        agency: agencies[2]._id,
        destination: destinations[4]._id,
        image: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/New_York_-_Manhattan_-_Plaza_Hotel.jpg',
        gallery: [
          'https://upload.wikimedia.org/wikipedia/commons/8/8b/New_York_-_Manhattan_-_Plaza_Hotel.jpg', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoV_du3XvtLcLDRyNsm24WWwykbc1k-aax7A&s', 'https://www.theplazany.com/wp-content/uploads/2022/02/Exterior_Night_1151x500.jpg', 'https://www.ca.kayak.com/rimg/himg/bd/43/4a/ice-135506-109412228-288542.jpg?width=1366&height=768&crop=true', 'https://www.ahstatic.com/photos/a568_rokga_00_p_1024x768.jpg'
        ]
      }
    ])

    console.log('📦 Kuriami atsiliepimai...')
    await Review.insertMany([
      {
        user: users[1]._id,
        destination: destinations[0]._id,
        hotel: null,
        agency: agencies[1]._id,
        rating: 5,
        comment: 'Amazing experience!'
      },
      {
        user: users[2]._id,
        destination: null,
        hotel: null,
        agency: agencies[0]._id,
        rating: 4,
        comment: 'Good service but a bit pricey.'
      },
      {
        user: users[3]._id,
        destination: null,
        hotel: null,
        agency: agencies[2]._id,
        rating: 3,
        comment: 'Average experience.'
      },
      {
        user: users[4]._id,
        destination: destinations[1]._id,
        hotel: null,
        agency: agencies[3]._id,
        rating: 5,
        comment: 'Loved the glacier tour!'
      },
      {
        user: users[0]._id,
        destination: null,
        hotel: null,
        agency: agencies[4]._id,
        rating: 4,
        comment: 'Great hotel with a nice view!'
      }

    ])

    console.log('✅ Duomenys sėkmingai įkelti!')
    process.exit()
  } catch (error) {
    console.error('❌ Klaida seedinant:', error)
    process.exit(1)
  }
}

seedData()
