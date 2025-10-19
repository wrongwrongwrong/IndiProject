// Language switching functionality
let currentLanguage = localStorage.getItem('gameserverpro_language') || 'en';

// Language translations
const translations = {
    en: {
        // Navigation
        home: 'Home',
        services: 'Services',
        about: 'About',
        contact: 'Contact',
        login: 'Login',
        signup: 'Sign Up',
        
        // Hero section
        heroTitle: 'Professional Gaming Server Descriptions',
        heroSubtitle: 'Transform your gaming server with custom, professional descriptions that attract players and build thriving communities.',
        getStarted: 'Get Started',
        learnMore: 'Learn More',
        
        // Services
        whatWeOffer: 'What We Offer',
        everythingYouNeed: 'Everything you need to grow your gaming server',
        customDescriptions: 'Custom Descriptions',
        customDescriptionsDesc: 'AI-powered descriptions that attract players and showcase your server\'s unique features.',
        tryNow: 'Try Now',
        digitalWallet: 'Digital Wallet',
        digitalWalletDesc: 'Secure payment processing and peer-to-peer transfers for the gaming community.',
        manageWallet: 'Manage Wallet',
        socialSharing: 'Social Sharing',
        socialSharingDesc: 'Share your server descriptions and grow your community through social networks.',
        shareServer: 'Share Server',
        viewAllServices: 'View All Services',
        
        // Features
        whyChooseUs: 'Why Choose GameServer Pro?',
        builtForCommunities: 'Built for gaming communities, by gaming communities',
        cloudPowered: 'Cloud-Powered',
        cloudPoweredDesc: 'Built on enterprise-grade cloud infrastructure for reliability and scalability.',
        secureSafe: 'Secure & Safe',
        secureSafeDesc: 'Bank-level security with encrypted transactions and protected user data.',
        lightningFast: 'Lightning Fast',
        lightningFastDesc: 'Optimized for speed with instant description generation and real-time updates.',
        support247: '24/7 Support',
        support247Desc: 'Round-the-clock support from our dedicated gaming community experts.',
        
        // CTA
        readyToTransform: 'Ready to Transform Your Server?',
        joinThousands: 'Join thousands of gaming communities already using GameServer Pro',
        startFreeTrial: 'Start Free Trial',
        contactSales: 'Contact Sales',
        
        // Footer
        footerDesc: 'Professional gaming server descriptions powered by cloud computing.',
        company: 'Company',
        support: 'Support',
        
        // Modals
        createCustomDescription: 'Create Custom Server Description',
        serverName: 'Server Name',
        enterServerName: 'Enter your server name',
        gameType: 'Game Type',
        selectGameType: 'Select Game Type',
        minecraft: 'Minecraft',
        csgo: 'Counter-Strike: GO',
        rust: 'Rust',
        ark: 'ARK: Survival Evolved',
        gmod: 'Garry\'s Mod',
        tf2: 'Team Fortress 2',
        other: 'Other',
        serverStyle: 'Server Style',
        selectStyle: 'Select Style',
        casual: 'Casual',
        competitive: 'Competitive',
        roleplay: 'Roleplay',
        creative: 'Creative',
        survival: 'Survival',
        pvp: 'PvP',
        keyFeatures: 'Key Features (Optional)',
        keyFeaturesPlaceholder: 'Describe your server\'s unique features, plugins, or special events',
        targetAudience: 'Target Audience',
        selectTargetAudience: 'Select Target Audience',
        beginners: 'Beginners',
        experienced: 'Experienced Players',
        allSkillLevels: 'All Skill Levels',
        adultsOnly: 'Adults Only',
        familyFriendly: 'Family Friendly',
        generateDescription: 'Generate Description',
        generatedDescription: 'Generated Description',
        regenerate: 'Regenerate',
        saveShare: 'Save & Share',
        
        // Login/Signup
        fullName: 'Full Name',
        email: 'Email',
        password: 'Password',
        signUp: 'Sign Up',
        
        // Services page
        servicesHeroTitle: 'Our Services',
        servicesHeroSubtitle: 'Everything you need to grow your gaming server',
        customDescriptionsTitle: 'Custom Server Descriptions',
        customDescriptionsDesc: 'AI-powered descriptions that attract players and showcase your server\'s unique features.',
        digitalWalletTitle: 'Digital Wallet',
        digitalWalletDesc: 'Secure payment processing and peer-to-peer transfers for the gaming community.',
        socialSharingTitle: 'Social Sharing',
        socialSharingDesc: 'Share your server descriptions and grow your community through social networks.',
        analyticsTitle: 'Analytics Dashboard',
        analyticsDesc: 'Track your server\'s performance, player engagement, and growth metrics with our comprehensive analytics.',
        analyticsFeatures: ['Real-time metrics', 'Player engagement data', 'Growth tracking', 'Custom reports'],
        pricingTitle: 'Pricing Plans',
        pricingSubtitle: 'Choose the plan that works for you',
        freePlan: 'Free Plan',
        proPlan: 'Pro Plan',
        enterprisePlan: 'Enterprise Plan',
        getStarted: 'Get Started',
        contactSales: 'Contact Sales',
        
        // About page
        aboutHeroTitle: 'About GameServer Pro',
        aboutHeroSubtitle: 'Empowering gaming communities with professional server solutions',
        ourStory: 'Our Story',
        ourStoryDesc: 'Founded by gaming enthusiasts, GameServer Pro has been helping communities grow since 2020.',
        ourMission: 'Our Mission',
        ourMissionDesc: 'To empower gaming communities with professional tools and services.',
        ourVision: 'Our Vision',
        ourVisionDesc: 'A world where every gaming server can reach its full potential.',
        teamTitle: 'Our Team',
        teamSubtitle: 'Meet the people behind GameServer Pro',
        valuesTitle: 'Our Values',
        valuesSubtitle: 'What drives us forward',
        innovation: 'Innovation',
        innovationDesc: 'We constantly push the boundaries of what\'s possible.',
        community: 'Community',
        communityDesc: 'We believe in the power of gaming communities.',
        quality: 'Quality',
        qualityDesc: 'We deliver excellence in everything we do.',
        
        // Contact page
        contactHeroTitle: 'Contact Us',
        contactHeroSubtitle: 'Get in touch with our team',
        contactInfo: 'Contact Information',
        contactMethods: 'Get in Touch',
        emailUs: 'Email Us',
        emailUsDesc: 'Send us an email and we\'ll respond within 24 hours.',
        callUs: 'Call Us',
        callUsDesc: 'Speak with our support team directly.',
        visitUs: 'Visit Us',
        visitUsDesc: 'Come visit our office in San Francisco.',
        contactForm: 'Send us a Message',
        name: 'Name',
        subject: 'Subject',
        message: 'Message',
        sendMessage: 'Send Message',
        faqTitle: 'Frequently Asked Questions',
        faqSubtitle: 'Find answers to common questions',
        
        // Wallet page
        walletTitle: 'Digital Wallet',
        walletSubtitle: 'Manage your funds and transactions',
        balance: 'Balance',
        addFunds: 'Add Funds',
        transfer: 'Transfer',
        transactions: 'Recent Transactions',
        paymentMethods: 'Payment Methods',
        friends: 'Friends',
        addFriend: 'Add Friend',
        noTransactions: 'No recent transactions',
        noFriends: 'No friends added yet',
        viewAll: 'View All',
        addMethod: 'Add Payment Method',
        
        // Dashboard page
        dashboardTitle: 'Dashboard',
        dashboardSubtitle: 'Manage your server descriptions',
        overview: 'Overview',
        recentDescriptions: 'Recent Descriptions',
        generateNew: 'Generate New',
        shareDescription: 'Share',
        editDescription: 'Edit',
        deleteDescription: 'Delete',
        noDescriptions: 'No descriptions yet',
        createFirst: 'Create your first description'
    },
    
    zh: {
        // Navigation
        home: '首页',
        services: '服务',
        about: '关于我们',
        contact: '联系我们',
        login: '登录',
        signup: '注册',
        
        // Hero section
        heroTitle: '专业游戏服务器描述',
        heroSubtitle: '用定制、专业的描述改造您的游戏服务器，吸引玩家并建立繁荣的社区。',
        getStarted: '开始使用',
        learnMore: '了解更多',
        
        // Services
        whatWeOffer: '我们的服务',
        everythingYouNeed: '发展游戏服务器所需的一切',
        customDescriptions: '定制描述',
        customDescriptionsDesc: 'AI驱动的描述，吸引玩家并展示您服务器的独特功能。',
        tryNow: '立即试用',
        digitalWallet: '数字钱包',
        digitalWalletDesc: '安全的支付处理和游戏社区的点对点转账。',
        manageWallet: '管理钱包',
        socialSharing: '社交分享',
        socialSharingDesc: '分享您的服务器描述，通过社交网络发展您的社区。',
        shareServer: '分享服务器',
        viewAllServices: '查看所有服务',
        
        // Features
        whyChooseUs: '为什么选择GameServer Pro？',
        builtForCommunities: '为游戏社区而建，由游戏社区打造',
        cloudPowered: '云端驱动',
        cloudPoweredDesc: '基于企业级云基础设施构建，确保可靠性和可扩展性。',
        secureSafe: '安全可靠',
        secureSafeDesc: '银行级安全，加密交易和保护用户数据。',
        lightningFast: '闪电般快速',
        lightningFastDesc: '为速度优化，即时描述生成和实时更新。',
        support247: '24/7支持',
        support247Desc: '我们专业的游戏社区专家提供全天候支持。',
        
        // CTA
        readyToTransform: '准备好改造您的服务器了吗？',
        joinThousands: '加入数千个已经在使用GameServer Pro的游戏社区',
        startFreeTrial: '开始免费试用',
        contactSales: '联系销售',
        
        // Footer
        footerDesc: '由云计算驱动的专业游戏服务器描述。',
        company: '公司',
        support: '支持',
        
        // Modals
        createCustomDescription: '创建定制服务器描述',
        serverName: '服务器名称',
        enterServerName: '输入您的服务器名称',
        gameType: '游戏类型',
        selectGameType: '选择游戏类型',
        minecraft: '我的世界',
        csgo: '反恐精英：全球攻势',
        rust: '腐蚀',
        ark: '方舟：生存进化',
        gmod: '盖瑞模组',
        tf2: '军团要塞2',
        other: '其他',
        serverStyle: '服务器风格',
        selectStyle: '选择风格',
        casual: '休闲',
        competitive: '竞技',
        roleplay: '角色扮演',
        creative: '创造',
        survival: '生存',
        pvp: '玩家对战',
        keyFeatures: '关键功能（可选）',
        keyFeaturesPlaceholder: '描述您服务器的独特功能、插件或特殊活动',
        targetAudience: '目标受众',
        selectTargetAudience: '选择目标受众',
        beginners: '初学者',
        experienced: '有经验的玩家',
        allSkillLevels: '所有技能水平',
        adultsOnly: '仅限成人',
        familyFriendly: '家庭友好',
        generateDescription: '生成描述',
        generatedDescription: '生成的描述',
        regenerate: '重新生成',
        saveShare: '保存并分享',
        
        // Login/Signup
        fullName: '全名',
        email: '邮箱',
        password: '密码',
        signUp: '注册',
        
        // Services page
        servicesHeroTitle: '我们的服务',
        servicesHeroSubtitle: '发展游戏服务器所需的一切',
        customDescriptionsTitle: '定制服务器描述',
        customDescriptionsDesc: 'AI驱动的描述，吸引玩家并展示您服务器的独特功能。',
        digitalWalletTitle: '数字钱包',
        digitalWalletDesc: '安全的支付处理和游戏社区的点对点转账。',
        socialSharingTitle: '社交分享',
        socialSharingDesc: '分享您的服务器描述，通过社交网络发展您的社区。',
        analyticsTitle: '分析仪表板',
        analyticsDesc: '跟踪您的服务器性能、玩家参与度和增长指标，提供全面的分析。',
        analyticsFeatures: ['实时指标', '玩家参与数据', '增长跟踪', '自定义报告'],
        pricingTitle: '定价计划',
        pricingSubtitle: '选择适合您的计划',
        freePlan: '免费计划',
        proPlan: '专业计划',
        enterprisePlan: '企业计划',
        getStarted: '开始使用',
        contactSales: '联系销售',
        
        // About page
        aboutHeroTitle: '关于GameServer Pro',
        aboutHeroSubtitle: '为游戏社区提供专业服务器解决方案',
        ourStory: '我们的故事',
        ourStoryDesc: '由游戏爱好者创立，GameServer Pro自2020年以来一直在帮助社区发展。',
        ourMission: '我们的使命',
        ourMissionDesc: '为游戏社区提供专业工具和服务。',
        ourVision: '我们的愿景',
        ourVisionDesc: '一个每个游戏服务器都能发挥其全部潜力的世界。',
        teamTitle: '我们的团队',
        teamSubtitle: '认识GameServer Pro背后的人们',
        valuesTitle: '我们的价值观',
        valuesSubtitle: '推动我们前进的动力',
        innovation: '创新',
        innovationDesc: '我们不断推动可能的边界。',
        community: '社区',
        communityDesc: '我们相信游戏社区的力量。',
        quality: '质量',
        qualityDesc: '我们在所做的一切中追求卓越。',
        
        // Contact page
        contactHeroTitle: '联系我们',
        contactHeroSubtitle: '与我们的团队取得联系',
        contactInfo: '联系信息',
        contactMethods: '联系方式',
        emailUs: '发送邮件',
        emailUsDesc: '发送邮件给我们，我们将在24小时内回复。',
        callUs: '致电我们',
        callUsDesc: '直接与我们的支持团队通话。',
        visitUs: '访问我们',
        visitUsDesc: '来旧金山参观我们的办公室。',
        contactForm: '发送消息',
        name: '姓名',
        subject: '主题',
        message: '消息',
        sendMessage: '发送消息',
        faqTitle: '常见问题',
        faqSubtitle: '找到常见问题的答案',
        
        // Wallet page
        walletTitle: '数字钱包',
        walletSubtitle: '管理您的资金和交易',
        balance: '余额',
        addFunds: '添加资金',
        transfer: '转账',
        transactions: '最近交易',
        paymentMethods: '支付方式',
        friends: '朋友',
        addFriend: '添加朋友',
        noTransactions: '没有最近的交易',
        noFriends: '还没有添加朋友',
        viewAll: '查看全部',
        addMethod: '添加支付方式',
        
        // Dashboard page
        dashboardTitle: '仪表板',
        dashboardSubtitle: '管理您的服务器描述',
        overview: '概览',
        recentDescriptions: '最近的描述',
        generateNew: '生成新的',
        shareDescription: '分享',
        editDescription: '编辑',
        deleteDescription: '删除',
        noDescriptions: '还没有描述',
        createFirst: '创建您的第一个描述'
    },
    
    ch: {
        // Navigation - Keep readable
        home: 'Home',
        services: 'Services',
        about: 'About',
        contact: 'Contact',
        login: 'Login',
        signup: 'Sign Up',
        
        // Hero section
        heroTitle: 'Professional ████ ████ Descriptions',
        heroSubtitle: 'Transform your ████ ████ with custom, professional ███████ that attract ████ and build thriving ████ ████.',
        getStarted: 'Get Started',
        learnMore: 'Learn More',
        
        // Services
        whatWeOffer: 'What We Offer',
        everythingYouNeed: 'Everything you need to grow your ████ ████',
        customDescriptions: 'Custom ███████',
        customDescriptionsDesc: 'AI-powered ███████ that attract ████ and showcase your ████\'s unique features.',
        tryNow: 'Try Now',
        digitalWallet: 'Digital Wallet',
        digitalWalletDesc: 'Secure payment processing and peer-to-peer transfers for the ████ ████.',
        manageWallet: 'Manage Wallet',
        socialSharing: 'Social Sharing',
        socialSharingDesc: 'Share your ████ ███████ and grow your ████ through social networks.',
        shareServer: 'Share ████',
        viewAllServices: 'View All Services',
        
        // Features
        whyChooseUs: 'Why Choose ████?',
        builtForCommunities: 'Built for ████ ████████, by ████ ████████',
        cloudPowered: 'Cloud-Powered',
        cloudPoweredDesc: 'Built on enterprise-grade cloud infrastructure for reliability and scalability.',
        secureSafe: 'Secure & Safe',
        secureSafeDesc: 'Bank-level security with encrypted transactions and protected user data.',
        lightningFast: 'Lightning Fast',
        lightningFastDesc: 'Optimized for speed with instant description generation and real-time updates.',
        support247: '24/7 Support',
        support247Desc: 'Round-the-clock support from our dedicated ████ ████████ experts.',
        
        // CTA
        readyToTransform: 'Ready to Transform Your ████?',
        joinThousands: 'Join thousands of ████ ████████ already using ████',
        startFreeTrial: 'Start Free Trial',
        contactSales: 'Contact Sales',
        
        // Footer
        footerDesc: 'Professional ████ ████ descriptions powered by cloud computing.',
        company: 'Company',
        support: 'Support',
        
        // Modals
        createCustomDescription: 'Create Custom ████ Description',
        serverName: 'Server Name',
        enterServerName: 'Enter your server name',
        gameType: 'Game Type',
        selectGameType: 'Select Game Type',
        minecraft: 'Minecraft',
        csgo: 'Counter-Strike: GO',
        rust: 'Rust',
        ark: 'ARK: Survival Evolved',
        gmod: 'Garry\'s Mod',
        tf2: 'Team Fortress 2',
        other: 'Other',
        serverStyle: 'Server Style',
        selectStyle: 'Select Style',
        casual: 'Casual',
        competitive: 'Competitive',
        roleplay: 'Roleplay',
        creative: 'Creative',
        survival: 'Survival',
        pvp: 'PvP',
        keyFeatures: 'Key Features (Optional)',
        keyFeaturesPlaceholder: 'Describe your server\'s unique features, plugins, or special events',
        targetAudience: 'Target Audience',
        selectTargetAudience: 'Select Target Audience',
        beginners: 'Beginners',
        experienced: 'Experienced Players',
        allSkillLevels: 'All Skill Levels',
        adultsOnly: 'Adults Only',
        familyFriendly: 'Family Friendly',
        generateDescription: 'Generate Description',
        generatedDescription: 'Generated Description',
        regenerate: 'Regenerate',
        saveShare: 'Save & Share',
        
        // Login/Signup
        fullName: 'Full Name',
        email: 'Email',
        password: 'Password',
        signUp: 'Sign Up',
        
        // Services page
        servicesHeroTitle: 'Our Services',
        servicesHeroSubtitle: 'Everything you need to grow your ████ ████',
        customDescriptionsTitle: 'Custom ███████',
        customDescriptionsDesc: 'AI-powered ███████ that attract ████ and showcase your ████\'s unique features.',
        digitalWalletTitle: 'Digital Wallet',
        digitalWalletDesc: 'Secure payment processing and peer-to-peer transfers for the ████ ████.',
        socialSharingTitle: 'Social Sharing',
        socialSharingDesc: 'Share your ████ ███████ and grow your ████ through social networks.',
        analyticsTitle: 'Analytics Dashboard',
        analyticsDesc: 'Track your ████\'s performance, ████ ██████████, and growth metrics with our comprehensive analytics.',
        analyticsFeatures: ['Real-time metrics', '█████ ██████████ data', 'Growth tracking', 'Custom reports'],
        pricingTitle: 'Pricing Plans',
        pricingSubtitle: 'Choose the plan that works for you',
        freePlan: 'Free Plan',
        proPlan: 'Pro Plan',
        enterprisePlan: 'Enterprise Plan',
        getStarted: 'Get Started',
        contactSales: 'Contact Sales',
        
        // About page
        aboutHeroTitle: 'About ████',
        aboutHeroSubtitle: 'Empowering ████ ████████ with professional ████ solutions',
        ourStory: 'Our Story',
        ourStoryDesc: 'Founded by ████ enthusiasts, ████ has been helping ████████ grow since 2020.',
        ourMission: 'Our Mission',
        ourMissionDesc: 'To empower ████ ████████ with professional tools and services.',
        ourVision: 'Our Vision',
        ourVisionDesc: 'A world where every ████ ████ can reach its full potential.',
        teamTitle: 'Our Team',
        teamSubtitle: 'Meet the people behind ████',
        valuesTitle: 'Our Values',
        valuesSubtitle: 'What drives us forward',
        innovation: 'Innovation',
        innovationDesc: 'We constantly push the boundaries of what\'s possible.',
        community: 'Community',
        communityDesc: 'We believe in the power of ████ ████████.',
        quality: 'Quality',
        qualityDesc: 'We deliver excellence in everything we do.',
        
        // Contact page
        contactHeroTitle: 'Contact Us',
        contactHeroSubtitle: 'Get in touch with our team',
        contactInfo: 'Contact Information',
        contactMethods: 'Get in Touch',
        emailUs: 'Email Us',
        emailUsDesc: 'Send us an email and we\'ll respond within 24 hours.',
        callUs: 'Call Us',
        callUsDesc: 'Speak with our support team directly.',
        visitUs: 'Visit Us',
        visitUsDesc: 'Come visit our office in San Francisco.',
        contactForm: 'Send us a Message',
        name: 'Name',
        subject: 'Subject',
        message: 'Message',
        sendMessage: 'Send Message',
        faqTitle: 'Frequently Asked Questions',
        faqSubtitle: 'Find answers to common questions',
        
        // Wallet page
        walletTitle: 'Digital Wallet',
        walletSubtitle: 'Manage your funds and transactions',
        balance: 'Balance',
        addFunds: 'Add Funds',
        transfer: 'Transfer',
        transactions: 'Recent Transactions',
        paymentMethods: 'Payment Methods',
        friends: 'Friends',
        addFriend: 'Add Friend',
        noTransactions: 'No recent transactions',
        noFriends: 'No friends added yet',
        viewAll: 'View All',
        addMethod: 'Add Payment Method',
        
        // Dashboard page
        dashboardTitle: 'Dashboard',
        dashboardSubtitle: 'Manage your ██████ ██████ descriptions',
        overview: 'Overview',
        recentDescriptions: 'Recent Descriptions',
        generateNew: 'Generate New',
        shareDescription: 'Share',
        editDescription: 'Edit',
        deleteDescription: 'Delete',
        noDescriptions: 'No descriptions yet',
        createFirst: 'Create your first description'
    }
};

// Language switching functions
function toggleLanguageDropdown() {
    const dropdown = document.getElementById('langDropdown');
    dropdown.classList.toggle('show');
}

function switchLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('gameserverpro_language', lang);
    
    // Update current language display
    const currentLangSpan = document.getElementById('currentLang');
    if (currentLangSpan) {
        if (lang === 'ch') {
            currentLangSpan.textContent = '████';
        } else {
            currentLangSpan.textContent = lang.toUpperCase();
        }
    }
    
    // Close dropdown
    const dropdown = document.getElementById('langDropdown');
    dropdown.classList.remove('show');
    
    // Update all text content
    updatePageContent();
    
    // Update username display
    updateUsernameDisplay();
    
    // Update logo display
    updateLogoDisplay();
}

function updatePageContent() {
    const t = translations[currentLanguage];
    
    // Update navigation
    updateElementText('[data-lang="home"]', t.home);
    updateElementText('[data-lang="services"]', t.services);
    updateElementText('[data-lang="about"]', t.about);
    updateElementText('[data-lang="contact"]', t.contact);
    updateElementText('[data-lang="login"]', t.login);
    updateElementText('[data-lang="signup"]', t.signup);
    
    // Update hero section
    updateElementText('[data-lang="heroTitle"]', t.heroTitle);
    updateElementText('[data-lang="heroSubtitle"]', t.heroSubtitle);
    updateElementText('[data-lang="getStarted"]', t.getStarted);
    updateElementText('[data-lang="learnMore"]', t.learnMore);
    
    // Update services section
    updateElementText('[data-lang="whatWeOffer"]', t.whatWeOffer);
    updateElementText('[data-lang="everythingYouNeed"]', t.everythingYouNeed);
    updateElementText('[data-lang="customDescriptions"]', t.customDescriptions);
    updateElementText('[data-lang="customDescriptionsDesc"]', t.customDescriptionsDesc);
    updateElementText('[data-lang="tryNow"]', t.tryNow);
    updateElementText('[data-lang="digitalWallet"]', t.digitalWallet);
    updateElementText('[data-lang="digitalWalletDesc"]', t.digitalWalletDesc);
    updateElementText('[data-lang="manageWallet"]', t.manageWallet);
    updateElementText('[data-lang="socialSharing"]', t.socialSharing);
    updateElementText('[data-lang="socialSharingDesc"]', t.socialSharingDesc);
    updateElementText('[data-lang="shareServer"]', t.shareServer);
    updateElementText('[data-lang="viewAllServices"]', t.viewAllServices);
    
    // Update features section
    updateElementText('[data-lang="whyChooseUs"]', t.whyChooseUs);
    updateElementText('[data-lang="builtForCommunities"]', t.builtForCommunities);
    updateElementText('[data-lang="cloudPowered"]', t.cloudPowered);
    updateElementText('[data-lang="cloudPoweredDesc"]', t.cloudPoweredDesc);
    updateElementText('[data-lang="secureSafe"]', t.secureSafe);
    updateElementText('[data-lang="secureSafeDesc"]', t.secureSafeDesc);
    updateElementText('[data-lang="lightningFast"]', t.lightningFast);
    updateElementText('[data-lang="lightningFastDesc"]', t.lightningFastDesc);
    updateElementText('[data-lang="support247"]', t.support247);
    updateElementText('[data-lang="support247Desc"]', t.support247Desc);
    
    // Update CTA section
    updateElementText('[data-lang="readyToTransform"]', t.readyToTransform);
    updateElementText('[data-lang="joinThousands"]', t.joinThousands);
    updateElementText('[data-lang="startFreeTrial"]', t.startFreeTrial);
    updateElementText('[data-lang="contactSales"]', t.contactSales);
    
    // Update footer
    updateElementText('[data-lang="footerDesc"]', t.footerDesc);
    updateElementText('[data-lang="company"]', t.company);
    updateElementText('[data-lang="support"]', t.support);
}

function updateElementText(selector, text) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        element.textContent = text;
    });
}

// Update username display with redaction for classified mode - removed since welcome message moved to dashboard hero
function updateUsernameDisplay() {
    // Removed .user-name references since welcome message moved to dashboard hero
    // const userElements = document.querySelectorAll('.user-name');
    // userElements.forEach(element => {
    //     if (currentLanguage === 'ch') {
    //         // Redact username in classified mode
    //         element.textContent = 'Welcome, ████████';
    //     } else {
    //         // Show normal username for other languages
    //         element.textContent = 'Welcome, User';
    //     }
    // });
}

// Update logo/company name display with redaction for classified mode
function updateLogoDisplay() {
    const logoElements = document.querySelectorAll('.nav-logo span');
    logoElements.forEach(element => {
        if (currentLanguage === 'ch') {
            // Redact company name in classified mode
            element.textContent = '████';
        } else {
            // Show normal company name for other languages
            element.textContent = 'GameServer Pro';
        }
    });
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set initial language display
    const currentLangSpan = document.getElementById('currentLang');
    if (currentLangSpan) {
        if (currentLanguage === 'ch') {
            currentLangSpan.textContent = '████';
        } else {
            currentLangSpan.textContent = currentLanguage.toUpperCase();
        }
    }
    
    // Update page content
    updatePageContent();
    
    // Update username display
    updateUsernameDisplay();
    
    // Update logo display
    updateLogoDisplay();
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        const langSwitcher = document.querySelector('.language-switcher');
        if (langSwitcher && !langSwitcher.contains(event.target)) {
            document.getElementById('langDropdown').classList.remove('show');
        }
    });
});

// GameServer Pro - Interactive JavaScript Functionality

// Global variables - now managed by AuthManager
let currentUser = window.authManager ? window.authManager.getCurrentUser() : null;
let isLoggedIn = window.authManager ? window.authManager.isAuthenticated() : false;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuthStatus();
});

// Initialize Application
function initializeApp() {
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize form handlers
    initializeFormHandlers();
    
    // Initialize modals
    initializeModals();
    
    // Initialize animations
    initializeAnimations();
}

// Mobile Menu Functionality
function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            // Only proceed if href is not just '#' and has a valid ID
            if (href && href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Form Handlers
function initializeFormHandlers() {
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Description form
    const descriptionForm = document.getElementById('descriptionForm');
    if (descriptionForm) {
        console.log('Description form found, adding event listener');
        descriptionForm.addEventListener('submit', handleDescriptionGeneration);
    } else {
        console.log('Description form not found!');
    }
    
    // Admin login form
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }
}

// Modal Functions
function initializeModals() {
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Close modals with escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    modal.style.display = 'none';
                }
            });
        }
    });
}

// Animation Functions
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.service-card, .pricing-card, .benefit-item, .stat-item').forEach(el => {
        observer.observe(el);
    });
}

// Authentication Functions
function checkAuthStatus() {
    const userData = localStorage.getItem('gameserverpro_user');
    if (userData) {
        currentUser = JSON.parse(userData);
        isLoggedIn = true;
        updateAuthUI();
    }
}

function updateAuthUI() {
    const navAuth = document.querySelector('.nav-auth');
    if (navAuth && isLoggedIn) {
        navAuth.innerHTML = `
            <div class="user-menu">
                <button class="btn-logout" onclick="logout()">Logout</button>
            </div>
        `;
    }
}

// Modal Functions
function openLoginModal() {
    clearModalErrors('loginModal');
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function openSignupModal() {
    clearModalErrors('signupModal');
    const modal = document.getElementById('signupModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeSignupModal() {
    const modal = document.getElementById('signupModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Admin Login Functions
function openAdminLogin() {
    const modal = document.getElementById('adminLoginModal');
    if (modal) {
        modal.classList.add('active');
    } else {
        console.error('Admin login modal not found');
        alert('Admin login modal not found. Please refresh the page.');
    }
}

function closeAdminLoginModal() {
    const modal = document.getElementById('adminLoginModal');
    if (modal) {
        modal.classList.remove('active');
        clearAdminLoginErrors();
    }
}

function clearAdminLoginErrors() {
    const messageDiv = document.getElementById('adminLoginMessage');
    if (messageDiv) {
        messageDiv.innerHTML = '';
        messageDiv.className = 'message';
    }
}

function showAdminLoginError(message) {
    const messageDiv = document.getElementById('adminLoginMessage');
    if (messageDiv) {
        messageDiv.innerHTML = message;
        messageDiv.className = 'message error';
    } else {
        console.error('Admin login message element not found');
        alert('Error: ' + message); // Fallback to alert if element not found
    }
}

function showAdminLoginSuccess(message) {
    const messageDiv = document.getElementById('adminLoginMessage');
    if (messageDiv) {
        messageDiv.innerHTML = message;
        messageDiv.className = 'message success';
    } else {
        console.error('Admin login message element not found');
        alert('Success: ' + message); // Fallback to alert if element not found
    }
}

// Handle admin login form submission
function handleAdminLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Clear any existing errors
    clearAdminLoginErrors();
    
    // Basic validation
    if (!email || !password) {
        showAdminLoginError('Please enter both email and password.');
        return;
    }
    
    // Show loading
    showLoading(e.target.querySelector('.btn-submit'));
    
    // Call API for admin login
    apiCall('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        signal: AbortSignal.timeout(10000) // 10 second timeout
    })
    .then(response => {
        // Check if response is ok
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        hideLoading(e.target.querySelector('.btn-submit'));
        
        if (data.success && data.user.isAdmin) {
            showAdminLoginSuccess('Admin login successful! Redirecting to admin dashboard...');
            
            // Store admin session
            localStorage.setItem('gameserverpro_admin', JSON.stringify(data.user));
            localStorage.setItem('gameserverpro_admin_token', data.token);
            
            // Redirect to admin dashboard after a short delay
            setTimeout(() => {
                const adminUrl = window.location.port === '5500' ? 'http://localhost:3000/admin' : '/admin';
                console.log('Redirecting to admin URL:', adminUrl);
                console.log('Current port:', window.location.port);
                window.location.href = adminUrl;
            }, 1500);
        } else {
            showAdminLoginError('Invalid admin credentials. Please check your email and password.');
        }
    })
    .catch(error => {
        hideLoading(e.target.querySelector('.btn-submit'));
        console.error('Admin login error:', error);
        showAdminLoginError('Login failed. Please try again.');
    });
}

function openDescriptionModal() {
    if (!isLoggedIn) {
        showMessage('Please login to access this feature.', 'error');
        openLoginModal();
        return;
    }
    const modal = document.getElementById('descriptionModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeDescriptionModal() {
    const modal = document.getElementById('descriptionModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function switchToSignup() {
    closeLoginModal();
    openSignupModal();
}

function switchToLogin() {
    closeSignupModal();
    openLoginModal();
}

// Service Functions
function openDescriptionGenerator() {
    openDescriptionModal();
}

function openWallet() {
    console.log('openWallet called, isLoggedIn:', isLoggedIn);
    console.log('currentUser:', currentUser);
    
    if (!isLoggedIn) {
        showMessage('Please login to access your wallet.', 'error');
        openLoginModal();
        return;
    }
    
    console.log('Redirecting to wallet.html');
    // Redirect to wallet page
    window.location.href = '04-wallet.html';
}

function openSharing() {
    console.log('openSharing called, isLoggedIn:', isLoggedIn);
    console.log('currentUser:', currentUser);
    
    if (!isLoggedIn) {
        showMessage('Please login to share your server.', 'error');
        openLoginModal();
        return;
    }
    
    console.log('Redirecting to dashboard.html');
    // Redirect to dashboard to manage and share descriptions
    window.location.href = '02-dashboard.html';
}

// Form Handlers
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject') || 'Contact Form Submission',
        message: formData.get('message')
    };
    
    // Basic validation
    if (!data.name || !data.email || !data.message) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    // Show loading
    showLoading(e.target.querySelector('.btn-submit'));
    
    // Call API for contact form submission
    apiCall('/api/contact', {
        method: 'POST',
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(10000) // 10 second timeout
    })
    .then(response => {
        // Check if response is ok
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        hideLoading(e.target.querySelector('.btn-submit'));
        showMessage(data.message || 'Thank you for your message! We\'ll get back to you soon.', 'success');
        e.target.reset();
    })
    .catch(error => {
        hideLoading(e.target.querySelector('.btn-submit'));
        console.error('Contact form error:', error);
        showMessage('Failed to send message. Please try again.', 'error');
    });
}

function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Clear any existing modal errors
    clearModalErrors('loginModal');
    
    // Show loading
    showLoading(e.target.querySelector('.btn-submit'));
    
    // Call local API
    apiCall('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        signal: AbortSignal.timeout(10000) // 10 second timeout
    })
    .then(response => {
        // Check if response is ok
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        hideLoading(e.target.querySelector('.btn-submit'));
        
        if (data.success) {
            // Use AuthManager for centralized auth state management
            if (window.authManager) {
                window.authManager.login(data.user, data.token);
            } else {
                // Fallback to old method if authManager not available
                currentUser = data.user;
                localStorage.setItem('gameserverpro_user', JSON.stringify(currentUser));
                localStorage.setItem('gameserverpro_token', data.token);
                isLoggedIn = true;
                updateAuthUI();
            }
            
            closeLoginModal();
            showMessage('Login successful!', 'success');
            e.target.reset();
        } else {
            // Handle specific login errors
            let errorMessage = 'Login failed';
            if (data.error) {
                if (data.error.includes('Invalid credentials') || data.error.includes('credentials')) {
                    errorMessage = 'Invalid email or password. Please check your credentials and try again.';
                } else if (data.error.includes('email')) {
                    errorMessage = 'Email not found. Please check your email address or create a new account.';
                } else if (data.error.includes('password')) {
                    errorMessage = 'Incorrect password. Please try again or reset your password.';
                } else {
                    errorMessage = data.error;
                }
            }
            showModalError('loginModal', errorMessage);
        }
    })
    .catch(error => {
        hideLoading(e.target.querySelector('.btn-submit'));
        console.error('Login error:', error);
        
        // Handle different types of errors
        let errorMessage = 'Login failed. Please try again.';
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage = 'Network error: Unable to connect to server. Please check your internet connection and try again.';
        } else if (error.message.includes('HTTP 500')) {
            errorMessage = 'Server error: Something went wrong on our end. Please try again in a few moments.';
        } else if (error.message.includes('HTTP 400')) {
            errorMessage = 'Invalid login data: Please check your email and password format.';
        } else if (error.message.includes('HTTP 401')) {
            errorMessage = 'Authentication failed: Invalid email or password.';
        } else if (error.message.includes('HTTP 429')) {
            errorMessage = 'Too many login attempts: Please wait a moment before trying again.';
        } else if (error.message.includes('timeout')) {
            errorMessage = 'Request timeout: The server is taking too long to respond. Please try again.';
        } else if (error.name === 'AbortError') {
            errorMessage = 'Request timeout: The server is taking too long to respond. Please try again.';
        }
        
        showModalError('loginModal', errorMessage);
    });
}

function handleSignup(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    // Clear any existing modal errors
    clearModalErrors('signupModal');
    
    // Validation
    if (password !== confirmPassword) {
        showModalError('signupModal', 'Passwords do not match.');
        return;
    }
    
    if (password.length < 6) {
        showModalError('signupModal', 'Password must be at least 6 characters.');
        return;
    }
    
    // Show loading
    showLoading(e.target.querySelector('.btn-submit'));
    
    // Call local API
    apiCall('/api/users/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
        signal: AbortSignal.timeout(10000) // 10 second timeout
    })
    .then(response => {
        // Check if response is ok
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        // Try to parse JSON, handle parsing errors
        return response.text().then(text => {
            try {
                return JSON.parse(text);
            } catch (parseError) {
                console.error('JSON Parse Error:', parseError);
                console.error('Response text:', text);
                throw new Error(`Invalid server response: ${text.substring(0, 100)}...`);
            }
        });
    })
    .then(data => {
        hideLoading(e.target.querySelector('.btn-submit'));
        
        if (data.success) {
            // Use AuthManager for centralized auth state management
            if (window.authManager) {
                window.authManager.login(data.user, data.token);
            } else {
                // Fallback to old method if authManager not available
                currentUser = data.user;
                localStorage.setItem('gameserverpro_user', JSON.stringify(currentUser));
                localStorage.setItem('gameserverpro_token', data.token);
                isLoggedIn = true;
                updateAuthUI();
            }
            
            closeSignupModal();
            showMessage('Account created successfully!', 'success');
            e.target.reset();
        } else {
            // Handle specific API errors
            let errorMessage = 'Registration failed';
            if (data.error) {
                if (data.error.includes('email')) {
                    errorMessage = 'This email is already registered. Please use a different email or try logging in.';
                } else if (data.error.includes('password')) {
                    errorMessage = 'Password requirements not met. Please check your password.';
                } else if (data.error.includes('name')) {
                    errorMessage = 'Please enter a valid name.';
                } else {
                    errorMessage = data.error;
                }
            }
            showModalError('signupModal', errorMessage);
        }
    })
    .catch(error => {
        hideLoading(e.target.querySelector('.btn-submit'));
        console.error('Registration error:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        // Handle different types of errors with specific messages
        let errorMessage;
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage = 'Network error: Unable to connect to server. Please check your internet connection and try again.';
        } else if (error.message.includes('HTTP 500')) {
            errorMessage = 'Server error: Something went wrong on our end. Please try again in a few moments.';
        } else if (error.message.includes('HTTP 400')) {
            errorMessage = 'Invalid data: Please check your information and try again.';
        } else if (error.message.includes('HTTP 409')) {
            errorMessage = 'Email already exists: This email is already registered. Please use a different email or try logging in.';
        } else if (error.message.includes('HTTP 429')) {
            errorMessage = 'Too many attempts: Please wait a moment before trying again.';
        } else if (error.message.includes('timeout')) {
            errorMessage = 'Request timeout: The server is taking too long to respond. Please try again.';
        } else if (error.name === 'AbortError') {
            errorMessage = 'Request timeout: The server is taking too long to respond. Please try again.';
        } else if (error.message.includes('HTTP 405')) {
            errorMessage = 'Method not allowed: The server does not support this request type. Please refresh the page and try again.';
        } else if (error.message.includes('HTTP 404')) {
            errorMessage = 'Endpoint not found: The registration service is not available. Please try again later.';
        } else if (error.message.includes('Invalid server response')) {
            errorMessage = 'Server returned invalid data. Please try again or contact support if the problem persists.';
        } else if (error.message.includes('JSON')) {
            errorMessage = 'Server response error. Please try again or contact support if the problem persists.';
        } else {
            // Debug: Show the actual error for troubleshooting
            errorMessage = `Error: ${error.message || error.name || 'Unknown error occurred'}. Please try again.`;
        }
        
        showModalError('signupModal', errorMessage);
    });
}

function handleDescriptionGeneration(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        serverName: formData.get('serverName'),
        gameType: formData.get('gameType'),
        serverFeatures: formData.get('serverFeatures'),
        descriptionStyle: formData.get('serverStyle'), // Fixed: was looking for 'descriptionStyle' but form has 'serverStyle'
        customRequirements: formData.get('targetAudience') // Map target audience to custom requirements
    };
    
    console.log('Description generation data:', data);
    console.log('API_BASE_URL:', API_BASE_URL);
    
    // Show loading
    const submitBtn = e.target.querySelector('.btn-submit');
    showLoading(submitBtn);
    
    // Call local API
    apiCall('/api/descriptions/generate', {
        method: 'POST',
        body: JSON.stringify(data)
    })
    .then(response => {
        console.log('API Response status:', response.status);
        console.log('API Response ok:', response.ok);
        return response.json();
    })
    .then(result => {
        console.log('API Response data:', result);
        hideLoading(submitBtn);
        
        if (result.success) {
            // Show generated content
            const generatedContent = document.getElementById('generatedDescription');
            const preview = generatedContent.querySelector('.description-preview');
            
            preview.textContent = result.description.description;
            generatedContent.style.display = 'block';
            
            // Scroll to generated content
            generatedContent.scrollIntoView({ behavior: 'smooth' });
            
            showMessage('Description generated successfully!', 'success');
        } else {
            showMessage(result.error || 'Failed to generate description', 'error');
        }
    })
    .catch(error => {
        hideLoading(submitBtn);
        console.error('Description generation error:', error);
        console.error('Error details:', error.message);
        showMessage('Failed to generate description. Please try again.', 'error');
    });
}

// Description Generation Logic
function generateServerDescription(data) {
    const templates = {
        professional: `🏆 **${data.serverName}** - Professional Gaming Experience

Welcome to ${data.serverName}, where competitive gaming meets professional standards. Our ${data.gameType} server offers:

${data.serverFeatures || '• High-performance dedicated hardware\n• 24/7 uptime guarantee\n• Professional moderation team\n• Regular tournaments and events'}

**Why Choose Us:**
• Low latency, high performance
• Fair play enforcement
• Active community management
• Regular updates and maintenance

Join ${data.serverName} today and experience gaming at its finest!`,

        casual: `🎮 **${data.serverName}** - Your Friendly Gaming Home

Hey there, fellow gamer! Welcome to ${data.serverName}, the most welcoming ${data.gameType} community around!

${data.serverFeatures || '• Friendly, helpful community\n• No pressure, just fun\n• Beginner-friendly environment\n• Regular community events'}

**What Makes Us Special:**
• Everyone is welcome here
• Helpful staff and players
• Fun events and activities
• Chill atmosphere

Come hang out with us at ${data.serverName} - we\'d love to have you! 😊`,

        competitive: `⚡ **${data.serverName}** - Elite Competitive Gaming

Ready to prove your skills? ${data.serverName} is the ultimate ${data.gameType} competitive platform.

${data.serverFeatures || '• Ranked matchmaking system\n• Professional tournaments\n• Skill-based progression\n• Competitive leaderboards'}

**Competitive Features:**
• High-stakes tournaments
• Skill-based matchmaking
• Professional coaching available
• Prize pools and rewards

Challenge yourself at ${data.serverName} - only the best survive!`,

        roleplay: `🎭 **${data.serverName}** - Immersive Roleplay Experience

Step into a world of endless possibilities at ${data.serverName}, the premier ${data.gameType} roleplay server.

${data.serverFeatures || '• Rich, detailed lore\n• Character development system\n• Interactive storylines\n• Professional roleplay events'}

**Roleplay Features:**
• Deep character customization
• Dynamic storylines
• Professional roleplay coaching
• Community-driven narratives

Begin your adventure at ${data.serverName} - where stories come to life!`
    };
    
    const generatedDescription = templates[data.descriptionStyle] || templates.casual;
    
    // Show generated content
    const generatedContent = document.getElementById('generatedDescription');
    const preview = generatedContent.querySelector('.description-preview');
    
    preview.textContent = generatedDescription;
    generatedContent.style.display = 'block';
    
    // Scroll to generated content
    generatedContent.scrollIntoView({ behavior: 'smooth' });
    
    showMessage('Description generated successfully!', 'success');
}

// API Configuration
const API_BASE_URL = window.location.port === '5500' ? 'http://localhost:3000' : '';

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    return fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    });
}

// Utility Functions
function showMessage(message, type = 'success') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Insert at top of page
    document.body.insertBefore(messageDiv, document.body.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Modal-specific error handling functions
function showModalError(modalId, message) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    // Remove existing modal errors
    clearModalErrors(modalId);
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'modal-error';
    errorDiv.textContent = message;
    
    // Insert error message at the top of modal content
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.insertBefore(errorDiv, modalContent.firstChild);
    }
}

function clearModalErrors(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    // Remove existing modal errors
    const existingErrors = modal.querySelectorAll('.modal-error');
    existingErrors.forEach(error => error.remove());
}

function showLoading(button) {
    const originalText = button.textContent;
    button.textContent = '';
    button.innerHTML = '<div class="loading"></div>';
    button.disabled = true;
    button.dataset.originalText = originalText;
}

function hideLoading(button) {
    const originalText = button.dataset.originalText;
    button.textContent = originalText;
    button.disabled = false;
}

function logout() {
    // Use AuthManager for centralized auth state management
    if (window.authManager) {
        window.authManager.logout();
    } else {
        // Fallback to old method if authManager not available
        localStorage.removeItem('gameserverpro_user');
        localStorage.removeItem('gameserverpro_token');
        currentUser = null;
        isLoggedIn = false;
        
        // Reset UI
        const navAuth = document.querySelector('.nav-auth');
        if (navAuth) {
            navAuth.innerHTML = `
                <button class="btn-login" onclick="openLoginModal()">Login</button>
                <button class="btn-signup" onclick="openSignupModal()">Sign Up</button>
            `;
        }
    }
    
    showMessage('Logged out successfully!', 'success');
}

// Navigation Functions
function openLogin() {
    openLoginModal();
}

function openSignup() {
    openSignupModal();
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

function exportData() {
    // Export user data functionality
    const userData = {
        user: AuthManager.getCurrentUser(),
        timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `gameserverpro-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showMessage('Data exported successfully!', 'success');
}

// Scroll Functions
function scrollToServices() {
    document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
}

function scrollToAbout() {
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
}

// Description Actions
function regenerateDescription() {
    const form = document.getElementById('descriptionForm');
    const submitBtn = form.querySelector('.btn-submit');
    
    showLoading(submitBtn);
    
    setTimeout(() => {
        hideLoading(submitBtn);
        const formData = new FormData(form);
        const data = {
            serverName: formData.get('serverName'),
            gameType: formData.get('gameType'),
            serverFeatures: formData.get('serverFeatures'),
            descriptionStyle: formData.get('serverStyle'), // Fixed: was looking for 'descriptionStyle' but form has 'serverStyle'
            customRequirements: formData.get('targetAudience') // Map target audience to custom requirements
        };
        
        generateServerDescription(data);
        showMessage('Description regenerated!', 'success');
    }, 2000);
}

function saveDescription() {
    const preview = document.querySelector('.description-preview');
    const description = preview.textContent;
    
    if (!description) {
        showMessage('No description to save', 'error');
        return;
    }
    
    // Get form data
    const form = document.getElementById('descriptionForm');
    const formData = new FormData(form);
    const serverName = formData.get('serverName');
    const gameType = formData.get('gameType');
    const descriptionStyle = formData.get('descriptionStyle');
    
    // Create description object
    const descriptionObj = {
        id: Date.now(),
        serverName: serverName || 'Untitled Server',
        gameType: gameType || 'Unknown',
        style: descriptionStyle || 'casual',
        description: description,
        createdAt: new Date().toISOString(),
        views: 0,
        shares: 0
    };
    
    // Save to localStorage
    let savedDescriptions = JSON.parse(localStorage.getItem('gameserverpro_descriptions') || '[]');
    savedDescriptions.unshift(descriptionObj); // Add to beginning
    localStorage.setItem('gameserverpro_descriptions', JSON.stringify(savedDescriptions));
    
    // Update dashboard data
    let dashboardData = JSON.parse(localStorage.getItem('gameserverpro_dashboard') || '{"totalDescriptions": 0, "totalViews": 0, "totalShares": 0}');
    dashboardData.totalDescriptions = savedDescriptions.length;
    localStorage.setItem('gameserverpro_dashboard', JSON.stringify(dashboardData));
    
    showMessage('Description saved successfully!', 'success');
    
    console.log('Description saved:', descriptionObj);
    
    // Close modal after saving
    setTimeout(() => {
        closeDescriptionModal();
        // Reset form
        form.reset();
        document.getElementById('generatedDescription').style.display = 'none';
    }, 1500);
}

// Event Listeners Setup
function setupEventListeners() {
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
    
    // Pricing card hover effects
    document.querySelectorAll('.pricing-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('featured')) {
                this.style.transform = 'translateY(0) scale(1)';
            } else {
                this.style.transform = 'scale(1.05)';
            }
        });
    });
    
    // Service card animations
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Initialize animations on scroll
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .pricing-card, .benefit-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeScrollAnimations);

// Export functions for global access
window.openLoginModal = openLoginModal;
window.closeLoginModal = closeLoginModal;
window.openLogin = openLogin;
window.openSignupModal = openSignupModal;
window.closeSignupModal = closeSignupModal;
window.openSignup = openSignup;
window.openAdminLogin = openAdminLogin;
window.closeAdminLoginModal = closeAdminLoginModal;
window.openDescriptionModal = openDescriptionModal;
window.closeDescriptionModal = closeDescriptionModal;
window.switchToSignup = switchToSignup;
window.switchToLogin = switchToLogin;
window.openDescriptionGenerator = openDescriptionGenerator;
window.openWallet = openWallet;
window.openSharing = openSharing;
window.scrollToServices = scrollToServices;
window.scrollToAbout = scrollToAbout;
window.scrollToSection = scrollToSection;
window.regenerateDescription = regenerateDescription;
window.saveDescription = saveDescription;
window.logout = logout;
window.toggleLanguageDropdown = toggleLanguageDropdown;
window.switchLanguage = switchLanguage;
window.exportData = exportData;
