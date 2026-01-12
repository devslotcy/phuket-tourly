import bcrypt from "bcrypt";
import { storage } from "./storage";

const ADMIN_EMAIL = "admin@phuket-tours.com";
const ADMIN_PASSWORD = "Admin123!";

export async function seedDatabase() {
  console.log("Checking for existing admin...");
  const adminCount = await storage.getAdminCount();
  
  if (adminCount === 0) {
    console.log("\n=== SEEDING DATABASE ===\n");
    
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await storage.createAdmin({
      email: ADMIN_EMAIL,
      passwordHash,
      role: "admin",
    });
    console.log("✓ Admin user created");
    console.log(`  Email: ${ADMIN_EMAIL}`);
    console.log(`  Password: ${ADMIN_PASSWORD}`);
    
    const categories = [
      { name: "Island Tours", slug: "island-tours", nameEn: "Island Tours", nameTr: "Ada Turları" },
      { name: "Adventure", slug: "adventure", nameEn: "Adventure", nameTr: "Macera" },
      { name: "Cultural", slug: "cultural", nameEn: "Cultural", nameTr: "Kültürel" },
    ];
    
    const createdCategories = [];
    for (const cat of categories) {
      const created = await storage.createCategory(cat);
      createdCategories.push(created);
    }
    console.log("✓ 3 categories created");
    
    const toursData = [
      {
        tour: { slug: "phi-phi-island-tour", featured: true, popular: true, priceFrom: 85, duration: "Full Day (8 hours)", categoryId: createdCategories[0].id },
        translations: {
          en: { title: "Phi Phi Islands Day Trip", summary: "Visit the stunning Phi Phi Islands with snorkeling, beach time, and lunch included.", highlights: "Crystal clear waters\nMaya Bay visit\nSnorkeling in pristine reefs\nBeach barbecue lunch\nSpeedboat transfer", itinerary: "7:30 AM: Hotel pickup\n9:00 AM: Speedboat departure\n10:30 AM: Maya Bay\n12:00 PM: Lunch at Phi Phi Don\n2:00 PM: Snorkeling\n4:00 PM: Return journey", includes: "Hotel pickup and drop-off\nSpeedboat transfers\nLunch and drinks\nSnorkeling equipment\nNational park fees", excludes: "Personal expenses\nTips\nAlcoholic beverages", pickupInfo: "Pickup from all Phuket hotels between 7:00-8:00 AM", cancellationPolicy: "Free cancellation up to 24 hours before the tour" },
          tr: { title: "Phi Phi Adaları Günlük Tur", summary: "Şnorkelli yüzme, plaj zamanı ve öğle yemeği dahil muhteşem Phi Phi Adaları'nı ziyaret edin.", highlights: "Kristal berraklığında sular\nMaya Bay ziyareti\nBakir resiflerde şnorkel\nPlaj barbekü öğle yemeği\nSürat teknesi transferi", itinerary: "7:30: Otel alımı\n9:00: Sürat teknesi kalkışı\n10:30: Maya Bay\n12:00: Phi Phi Don'da öğle yemeği\n14:00: Şnorkel\n16:00: Dönüş", includes: "Otel alım ve bırakma\nSürat teknesi transferleri\nÖğle yemeği ve içecekler\nŞnorkel ekipmanı\nMilli park ücretleri", excludes: "Kişisel harcamalar\nBahşişler\nAlkollü içecekler", pickupInfo: "Tüm Phuket otellerinden 07:00-08:00 arası alım", cancellationPolicy: "Turdan 24 saat öncesine kadar ücretsiz iptal" }
        },
        images: [{ url: "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=800" }]
      },
      {
        tour: { slug: "james-bond-island", featured: true, popular: false, priceFrom: 95, duration: "Full Day (9 hours)", categoryId: createdCategories[0].id },
        translations: {
          en: { title: "James Bond Island & Phang Nga Bay", summary: "Explore the famous James Bond Island and kayak through stunning limestone caves.", highlights: "James Bond Island\nKayaking through caves\nFloating Muslim village\nLunch on board", itinerary: "7:00 AM: Pickup\n9:00 AM: Arrive Phang Nga\n10:00 AM: Kayaking\n12:00 PM: James Bond Island\n2:00 PM: Lunch\n4:00 PM: Return", includes: "All transfers\nLunch\nKayaking\nGuide", excludes: "Drinks\nTips", pickupInfo: "Hotel pickup 7:00-8:00 AM", cancellationPolicy: "24 hour free cancellation" },
          tr: { title: "James Bond Adası ve Phang Nga Körfezi", summary: "Ünlü James Bond Adası'nı keşfedin ve muhteşem kireçtaşı mağaralarında kano yapın.", highlights: "James Bond Adası\nMağaralarda kano\nYüzen Müslüman köyü\nTeknede öğle yemeği", itinerary: "07:00: Alım\n09:00: Phang Nga varış\n10:00: Kano\n12:00: James Bond Adası\n14:00: Öğle yemeği\n16:00: Dönüş", includes: "Tüm transferler\nÖğle yemeği\nKano\nRehber", excludes: "İçecekler\nBahşişler", pickupInfo: "Otel alımı 07:00-08:00", cancellationPolicy: "24 saat ücretsiz iptal" }
        },
        images: [{ url: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800" }]
      },
      {
        tour: { slug: "elephant-sanctuary", featured: true, popular: true, priceFrom: 120, duration: "Half Day (5 hours)", categoryId: createdCategories[1].id },
        translations: {
          en: { title: "Ethical Elephant Sanctuary", summary: "Meet rescued elephants in an ethical sanctuary. Feed, bathe, and learn about these gentle giants.", highlights: "Meet rescued elephants\nFeed the elephants\nMud bath experience\nBathing in the river\nLearn about conservation", itinerary: "8:00 AM: Pickup\n9:30 AM: Arrive sanctuary\n10:00 AM: Introduction\n10:30 AM: Feeding\n11:30 AM: Mud bath\n12:30 PM: River bath\n1:30 PM: Return", includes: "Transport\nActivities\nLunch\nGuide", excludes: "Personal items\nTips", pickupInfo: "Morning pickup from hotels", cancellationPolicy: "48 hour cancellation" },
          tr: { title: "Etik Fil Barınağı", summary: "Etik bir barınakta kurtarılmış fillerle tanışın. Bu nazik devleri besleyin, yıkayın ve hakkında bilgi edinin.", highlights: "Kurtarılmış fillerle tanışma\nFilleri besleme\nÇamur banyosu deneyimi\nNehirde yıkanma\nKorunma hakkında bilgi", itinerary: "08:00: Alım\n09:30: Barınağa varış\n10:00: Tanıtım\n10:30: Besleme\n11:30: Çamur banyosu\n12:30: Nehir banyosu\n13:30: Dönüş", includes: "Ulaşım\nAktiviteler\nÖğle yemeği\nRehber", excludes: "Kişisel eşyalar\nBahşişler", pickupInfo: "Otellerden sabah alımı", cancellationPolicy: "48 saat iptal" }
        },
        images: [{ url: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800" }]
      },
      {
        tour: { slug: "big-buddha-temple-tour", featured: false, popular: true, priceFrom: 45, duration: "Half Day (4 hours)", categoryId: createdCategories[2].id },
        translations: {
          en: { title: "Big Buddha & Temple Tour", summary: "Visit the iconic Big Buddha statue and explore beautiful Thai temples with local guide.", highlights: "45m Big Buddha statue\nChalong Temple\nLocal guide\nPanoramic views", itinerary: "9:00 AM: Pickup\n9:30 AM: Chalong Temple\n10:30 AM: Big Buddha\n12:30 PM: Return", includes: "Transport\nGuide\nWater", excludes: "Temple donations\nLunch", pickupInfo: "Morning pickup", cancellationPolicy: "24 hour free cancellation" },
          tr: { title: "Büyük Buda ve Tapınak Turu", summary: "İkonik Büyük Buda heykelini ziyaret edin ve yerel rehberle güzel Tay tapınaklarını keşfedin.", highlights: "45m Büyük Buda heykeli\nChalong Tapınağı\nYerel rehber\nPanoramik manzaralar", itinerary: "09:00: Alım\n09:30: Chalong Tapınağı\n10:30: Büyük Buda\n12:30: Dönüş", includes: "Ulaşım\nRehber\nSu", excludes: "Tapınak bağışları\nÖğle yemeği", pickupInfo: "Sabah alımı", cancellationPolicy: "24 saat ücretsiz iptal" }
        },
        images: [{ url: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800" }]
      },
      {
        tour: { slug: "snorkeling-tour", featured: false, popular: false, priceFrom: 65, duration: "Full Day (7 hours)", categoryId: createdCategories[1].id },
        translations: {
          en: { title: "Racha Island Snorkeling", summary: "Crystal clear waters perfect for snorkeling at Racha Yai and Racha Noi islands.", highlights: "Two island stops\nClear visibility\nCoral reefs\nBeach time", itinerary: "8:00 AM: Pickup\n9:30 AM: Boat departure\n10:30 AM: Racha Yai\n12:30 PM: Lunch\n2:00 PM: Racha Noi\n4:30 PM: Return", includes: "Boat transfers\nLunch\nEquipment\nGuide", excludes: "Underwater camera\nTips", pickupInfo: "Hotel pickup 8:00 AM", cancellationPolicy: "24 hour cancellation" },
          tr: { title: "Racha Adası Şnorkel", summary: "Racha Yai ve Racha Noi adalarında şnorkel için mükemmel kristal berraklığında sular.", highlights: "İki ada durağı\nNet görüş\nMercan resifleri\nPlaj zamanı", itinerary: "08:00: Alım\n09:30: Tekne kalkışı\n10:30: Racha Yai\n12:30: Öğle yemeği\n14:00: Racha Noi\n16:30: Dönüş", includes: "Tekne transferleri\nÖğle yemeği\nEkipman\nRehber", excludes: "Su altı kamera\nBahşişler", pickupInfo: "Otel alımı 08:00", cancellationPolicy: "24 saat iptal" }
        },
        images: [{ url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800" }]
      },
      {
        tour: { slug: "cooking-class", featured: false, popular: true, priceFrom: 55, duration: "Half Day (4 hours)", categoryId: createdCategories[2].id },
        translations: {
          en: { title: "Thai Cooking Class", summary: "Learn to cook authentic Thai dishes with local chef. Market visit and hands-on cooking.", highlights: "Market visit\nHands-on cooking\n4 dishes\nRecipe book", itinerary: "9:00 AM: Market tour\n10:00 AM: Cooking starts\n12:30 PM: Enjoy your meal\n1:00 PM: End", includes: "All ingredients\nRecipe book\nMeal\nDrinks", excludes: "Transport\nTips", pickupInfo: "Self-arrival or add transport", cancellationPolicy: "24 hour cancellation" },
          tr: { title: "Thai Yemek Kursu", summary: "Yerel şefle otantik Thai yemekleri yapmayı öğrenin. Market ziyareti ve uygulamalı pişirme.", highlights: "Market ziyareti\nUygulamalı pişirme\n4 yemek\nTarif kitabı", itinerary: "09:00: Market turu\n10:00: Pişirme başlar\n12:30: Yemeğinizin tadını çıkarın\n13:00: Son", includes: "Tüm malzemeler\nTarif kitabı\nYemek\nİçecekler", excludes: "Ulaşım\nBahşişler", pickupInfo: "Kendi ulaşımınız veya transfer ekleyin", cancellationPolicy: "24 saat iptal" }
        },
        images: [{ url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800" }]
      },
    ];
    
    for (const data of toursData) {
      const tour = await storage.createTour(data.tour);
      await storage.createTourTranslation({ ...data.translations.en, tourId: tour.id, locale: "en" });
      await storage.createTourTranslation({ ...data.translations.tr, tourId: tour.id, locale: "tr" });
      await storage.updateTourImages(tour.id, data.images);
    }
    console.log("✓ 6 tours created");
    
    const faqsData = [
      { questionEn: "What should I bring on a tour?", answerEn: "We recommend sunscreen, swimwear, a towel, comfortable shoes, and a camera. All necessary equipment is provided.", questionTr: "Tura ne getirmeliyim?", answerTr: "Güneş kremi, mayo, havlu, rahat ayakkabı ve fotoğraf makinesi öneriyoruz. Gerekli tüm ekipmanlar sağlanır.", sortOrder: 1 },
      { questionEn: "Are tours suitable for children?", answerEn: "Most of our tours are family-friendly. Some adventure tours have age restrictions. Please check individual tour details.", questionTr: "Turlar çocuklar için uygun mu?", answerTr: "Turlarımızın çoğu aile dostudur. Bazı macera turlarının yaş sınırlamaları vardır. Lütfen bireysel tur detaylarını kontrol edin.", sortOrder: 2 },
      { questionEn: "What is your cancellation policy?", answerEn: "Free cancellation is available up to 24-48 hours before the tour, depending on the tour type. Full refund will be processed.", questionTr: "İptal politikanız nedir?", answerTr: "Tur tipine bağlı olarak turdan 24-48 saat öncesine kadar ücretsiz iptal yapılabilir. Tam iade işlenir.", sortOrder: 3 },
      { questionEn: "Do you offer hotel pickup?", answerEn: "Yes! Complimentary hotel pickup and drop-off is included for all hotels in Phuket.", questionTr: "Otel alımı sunuyor musunuz?", answerTr: "Evet! Phuket'teki tüm oteller için ücretsiz otel alımı ve bırakma dahildir.", sortOrder: 4 },
    ];
    
    for (const faq of faqsData) {
      await storage.createFaq(faq);
    }
    console.log("✓ 4 FAQs created");
    
    const reviewsData = [
      { name: "Sarah Johnson", rating: 5, textEn: "Amazing experience! The Phi Phi tour was absolutely breathtaking. Our guide was knowledgeable and friendly. Highly recommend!", textTr: "Harika bir deneyim! Phi Phi turu kesinlikle nefes kesiciydi. Rehberimiz bilgili ve arkadaş canlısıydı. Kesinlikle tavsiye ederim!", source: "TripAdvisor" },
      { name: "Michael Chen", rating: 5, textEn: "The elephant sanctuary tour was incredible. Seeing these gentle giants up close was unforgettable. Ethical and educational.", textTr: "Fil barınağı turu inanılmazdı. Bu nazik devleri yakından görmek unutulmazdı. Etik ve eğitici.", source: "Google" },
      { name: "Emma Wilson", rating: 5, textEn: "James Bond Island exceeded expectations! The kayaking through caves was magical. Worth every penny.", textTr: "James Bond Adası beklentileri aştı! Mağaralardan kano yapmak büyüleyiciydi. Her kuruşuna değer.", source: "Booking.com" },
      { name: "Ahmet Yılmaz", rating: 4, textEn: "Great cooking class! Learned so much about Thai cuisine. The market tour was a nice touch.", textTr: "Harika yemek kursu! Thai mutfağı hakkında çok şey öğrendim. Market turu güzel bir dokunuştu.", source: "TripAdvisor" },
      { name: "Lisa Anderson", rating: 5, textEn: "Professional service from start to finish. The pickup was on time and the tour guide spoke excellent English.", textTr: "Başından sonuna profesyonel hizmet. Alım zamanındaydı ve tur rehberi mükemmel İngilizce konuşuyordu.", source: "Google" },
    ];
    
    for (const review of reviewsData) {
      await storage.createReview(review);
    }
    console.log("✓ 5 reviews created");
    
    const blogData = [
      {
        post: { slug: "best-beaches-phuket", imageUrl: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800", tags: "beaches,travel,phuket", published: true },
        translations: {
          en: { title: "10 Best Beaches in Phuket", content: "Phuket is home to some of Thailand's most stunning beaches. From the bustling Patong to the serene Freedom Beach, there's something for everyone.\n\n1. Patong Beach - The most famous and lively\n2. Kata Beach - Perfect for families\n3. Karon Beach - Long stretches of sand\n4. Freedom Beach - Hidden gem\n5. Surin Beach - Upscale and beautiful", excerpt: "Discover the top beaches in Phuket for your perfect tropical getaway.", seoTitle: "Best Beaches in Phuket 2025", seoDescription: "Explore the 10 most beautiful beaches in Phuket Thailand" },
          tr: { title: "Phuket'in En İyi 10 Plajı", content: "Phuket, Tayland'ın en çarpıcı plajlarından bazılarına ev sahipliği yapmaktadır. Kalabalık Patong'dan sakin Freedom Beach'e kadar herkes için bir şeyler var.\n\n1. Patong Plajı - En ünlü ve canlı\n2. Kata Plajı - Aileler için mükemmel\n3. Karon Plajı - Uzun kum şeritleri\n4. Freedom Beach - Gizli mücevher\n5. Surin Plajı - Lüks ve güzel", excerpt: "Mükemmel tropik kaçamağınız için Phuket'in en iyi plajlarını keşfedin.", seoTitle: "Phuket'in En İyi Plajları 2025", seoDescription: "Phuket Tayland'ın en güzel 10 plajını keşfedin" }
        }
      },
      {
        post: { slug: "thai-food-guide", imageUrl: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800", tags: "food,culture,thai", published: true },
        translations: {
          en: { title: "Ultimate Thai Food Guide for Travelers", content: "Thai cuisine is a explosion of flavors. From street food to fine dining, here's what you need to try.\n\nMust-try dishes:\n- Pad Thai\n- Tom Yum Goong\n- Green Curry\n- Mango Sticky Rice\n- Som Tam (Papaya Salad)", excerpt: "Your complete guide to Thai food and must-try dishes in Phuket.", seoTitle: "Thai Food Guide for Tourists", seoDescription: "Complete Thai food guide for travelers" },
          tr: { title: "Gezginler İçin Thai Yemek Rehberi", content: "Thai mutfağı tatların patlamasıdır. Sokak yemeğinden lüks restorana, denemeniz gerekenler.\n\nDenenmesi gereken yemekler:\n- Pad Thai\n- Tom Yum Goong\n- Yeşil Köri\n- Mangolu Yapışkan Pirinç\n- Som Tam (Papaya Salatası)", excerpt: "Phuket'te Thai yemekleri ve denemeniz gereken yemekler için tam rehberiniz.", seoTitle: "Turistler İçin Thai Yemek Rehberi", seoDescription: "Gezginler için kapsamlı Thai yemek rehberi" }
        }
      },
      {
        post: { slug: "phuket-travel-tips", imageUrl: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800", tags: "tips,travel,guide", published: true },
        translations: {
          en: { title: "Essential Phuket Travel Tips for First-Timers", content: "Planning your first trip to Phuket? Here are essential tips to make your vacation smooth and memorable.\n\n1. Best time to visit: November to February\n2. Currency: Thai Baht\n3. Transport: Rent a scooter or use Grab\n4. Respect temples: Dress appropriately\n5. Bargain at markets", excerpt: "First time in Phuket? Read these essential travel tips before you go.", seoTitle: "Phuket Travel Tips 2025", seoDescription: "Essential tips for first-time Phuket visitors" },
          tr: { title: "İlk Kez Gidenler İçin Phuket Seyahat İpuçları", content: "Phuket'e ilk seyahatinizi mi planlıyorsunuz? Tatilinizi sorunsuz ve unutulmaz kılmak için temel ipuçları.\n\n1. Ziyaret için en iyi zaman: Kasım-Şubat\n2. Para birimi: Thai Baht\n3. Ulaşım: Scooter kiralayın veya Grab kullanın\n4. Tapınaklara saygı: Uygun giyinin\n5. Pazarlarda pazarlık yapın", excerpt: "Phuket'e ilk kez mi gidiyorsunuz? Gitmeden önce bu temel seyahat ipuçlarını okuyun.", seoTitle: "Phuket Seyahat İpuçları 2025", seoDescription: "İlk kez Phuket'e gidenler için temel ipuçları" }
        }
      },
    ];
    
    for (const data of blogData) {
      const post = await storage.createBlogPost(data.post);
      await storage.createBlogPostTranslation({ ...data.translations.en, blogPostId: post.id, locale: "en" });
      await storage.createBlogPostTranslation({ ...data.translations.tr, blogPostId: post.id, locale: "tr" });
    }
    console.log("✓ 3 blog posts created");
    
    console.log("\n=== SEEDING COMPLETE ===");
    console.log(`\nAdmin credentials:`);
    console.log(`  Email: ${ADMIN_EMAIL}`);
    console.log(`  Password: ${ADMIN_PASSWORD}\n`);
  } else {
    console.log("Database already seeded, skipping...");
  }
}
