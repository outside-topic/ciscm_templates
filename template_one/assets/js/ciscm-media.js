/* =====================================================================
   CISCM — MEDIA SETTINGS
   ---------------------------------------------------------------------
   Every logo, background video and background photo is set here.
   In the HTML, an element with  data-cxm-video="homeHero"  plays the
   videos listed under VIDEOS.homeHero; an element with
   data-cxm-photo="port"  shows PHOTOS.port as its background.

   VIDEOS: list one or more .mp4 links. The browser plays the first that
   works. If none load, the poster photo and colour overlay stay visible.

   Sources:
   - ciscm.us  : CISCM's own hero video and page images
   - Mixkit    : free stock clips (mixkit.co). Mixkit uses two licences —
                 most clips are free for commercial use ("Mixkit License"),
                 some are "Restricted" (personal use only). Check each
                 clip's page before launch.
   - Unsplash  : photos already used on ciscm.us (Unsplash License)
   ===================================================================== */
(function () {
  var site = function (file) {
    return "https://ciscm.us/contents/frontend/images/" + file;
  };
  var mixkit = function (id) {
    return ["https://assets.mixkit.co/videos/" + id + "/" + id + "-720.mp4", "https://assets.mixkit.co/videos/" + id + "/" + id + "-360.mp4"];
  };
  var unsplash = function (id) {
    return "https://images.unsplash.com/photo-" + id + "?q=80&w=1800&auto=format&fit=crop";
  };

  window.CXM_MEDIA = {
    /* Header & footer logo. If it fails to load, the built-in CISCM wordmark shows instead.
       A white / light version suits the dark header best. */
    logo: site("CISCM_footer.png"),

    photos: {
      port: "./assets/images/slider_4_img.jpg",
      containers: unsplash("1494412685616-a5d310fbb07d"),
      // containers: './assets/images/slider_cont_img.jpg',
      // aboutHero: unsplash("1519213887655-a4f199e3015b"),
      aboutHero: './assets/images/slider_cont_img.jpg',
      membershipHero: unsplash("1606964212858-c215029db704"),
      qualityHero: unsplash("1589330694653-ded6df03f754"),
      credentials: site("credentials.jpeg"),
      accreditation: site("acc_over.jpeg"),
      institutional: site("Accreditation_photo.jpg.jpeg"),
      program: site("Program_accreditation.jpg.jpeg"),
      standards: site("pro_standard.jpeg"),
      employers: site("employers.jpeg"),
      providers: site("education_providers.jpeg"),
      academies: site("corporate_academics.jpeg"),
      claims: site("pclaim.jpg"),
      claimsPractice: site("public_claims.jpeg"),
      complaints: site("complaints.jpg"),
      appeals: site("appeals.jpg"),
    },

    videos: {
      homeHero: ["https://ciscm.us/contents/frontend/videos/suply_chain_hero.mp4"].concat(mixkit(35869)), // CISCM hero; fallback: cargo ship leaving port
      homeBand: mixkit(30065), // Busy container port time lapse
      closingCta: mixkit(30121), // Illuminated container port at night
      about: mixkit(36337), // Large container area, aerial
      standards: mixkit(20179), // Trading port and cranes time lapse
      credentials: mixkit(31019), // Container cranes unloading a ship
      membership: mixkit(4809), // Business people at a work meeting
      accreditation: mixkit(42666), // Presentation during a team meeting
      solutions: mixkit(45848), // Forklift driver in a warehouse
      services: mixkit(23011), // Freight truck arriving at a warehouse
      integrity: mixkit(28787), // Cargo truck on the highway
      verify: mixkit(241), // Signing a contract
      contact: mixkit(52447), // Aerial view of freight trucks
    },
  };
})();
