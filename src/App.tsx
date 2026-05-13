import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  X,
  Library,
  Settings,
  CheckCircle2,
  ShoppingBag,
  ExternalLink,
  Play,
  FileText,
  MessageSquare,
  Video,
  Lock,
  User,
  Eye,
  EyeOff,
  LogOut,
  Camera,
  Mail,
  Phone,
  Calendar,
  MapPin,
  CreditCard,
  ChevronDown,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import { Book, PortalType } from './types';

// Mock/Initial Books API wrapper
const api = {
  fetchBooks: async () => {
    const res = await fetch('/api/books');
    return res.json();
  },
  createBook: async (book: Omit<Book, 'id'>) => {
    const res = await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book)
    });
    return res.json();
  },
  updateBook: async (id: string, book: Partial<Book>) => {
    const res = await fetch(`/api/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book)
    });
    return res.json();
  },
  deleteBook: async (id: string) => {
    await fetch(`/api/books/${id}`, { method: 'DELETE' });
  }
};

export default function App() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [user, setUser] = useState<{name: string, role: string} | null>(() => {
    const saved = localStorage.getItem('bookbridge_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('bookbridge_auth') === 'true';
  });

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    const data = await api.fetchBooks();
    setBooks(data);
  };

  const handleLogin = (name: string, role: string) => {
    const userData = { name, role };
    localStorage.setItem('bookbridge_auth', 'true');
    localStorage.setItem('bookbridge_user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    navigate('/home', { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem('bookbridge_auth');
    localStorage.removeItem('bookbridge_user');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login', { replace: true });
  };

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/home" replace /> : <LoginView onLogin={handleLogin} />
      } />
      
      <Route path="/" element={
        isAuthenticated ? <Layout user={user} books={books} onLogout={handleLogout} /> : <Navigate to="/login" replace />
      }>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<HomeView books={books} />} />
        <Route path="student" element={<CatalogView portal="Student" books={books} onRefresh={loadBooks} />} />
        <Route path="employee" element={<CatalogView portal="Employee" books={books} onRefresh={loadBooks} />} />
        <Route path="blog" element={<BlogView books={books} />} />
        <Route path="documents" element={<DocumentsView />} />
        <Route path="admin" element={<CatalogView portal="Admin" books={books} onRefresh={loadBooks} />} />
        <Route path="branch" element={<BranchDirectoryView books={books} />} />
        <Route path="profile" element={<ProfileView user={user} onLogout={handleLogout} />} />
      </Route>
    </Routes>
  );
}

const PORTAL_PROFILES: Record<PortalType, any> = {
  Home: { 
    name: 'Guest Access', 
    id: 'GST-000', 
    detail: 'Public Entry',
    email: 'guest@bookbridge.io',
    phone: 'N/A',
    joinDate: 'May 2026',
    location: 'Cloud Node 01'
  },
  Student: { 
    name: 'Max Verstappen', 
    id: 'STUD-2026-001', 
    detail: 'Aero Engineering',
    dob: '30 Sept 1997',
    phone: '+31 6 1234 5678',
    email: 'verstappen.f1@student.edu',
    joinDate: 'March 2023',
    location: 'Main Campus'
  },
  Employee: { 
    name: 'Christian Horner', 
    id: 'EMP-3301', 
    detail: 'Pit Crew Ops',
    email: 'horner.c@racing.ops',
    phone: '+44 20 7946 0001',
    joinDate: 'Jan 2010',
    location: 'Pitlane Hub'
  },
  Admin: { 
    name: 'Toto Wolff', 
    id: 'ADM-0001', 
    detail: 'Strategy Control',
    email: 'toto.wolff@admin.hq',
    phone: '+43 1 2345 6789',
    joinDate: 'Feb 2013',
    location: 'Strategy Room'
  },
  Branch: { 
    name: 'Susie Wolff', 
    id: 'BRN-1010', 
    detail: 'Regional HQ',
    email: 'susie.w@regional.node',
    phone: '+44 7700 900001',
    joinDate: 'Aug 2018',
    location: 'London North'
  },
  Blog: { 
    name: 'Editorial Guest', 
    id: 'PUB-001', 
    detail: 'Media Center',
    email: 'media@editorial.ink',
    phone: 'N/A',
    joinDate: 'April 2025',
    location: 'Web Hub'
  },
  Profile: {
    name: 'Active User Profile',
    id: 'USR-8888',
    detail: 'Primary Node Account',
    email: 'primary@user.io',
    phone: '+0 123 456 7890',
    joinDate: 'May 2026',
    location: 'Global Grid'
  }
};

const EMPLOYEES_DATA = [
  { id: 'EMP-3301', name: 'Christian Horner', role: 'Pit Crew Ops', department: 'Operations' },
  { id: 'EMP-3302', name: 'Adrian Newey', role: 'Chief Technical Officer', department: 'Engineering' },
  { id: 'EMP-3303', name: 'Jonathan Wheatley', role: 'Sporting Director', department: 'Management' },
  { id: 'EMP-3304', name: 'Gianpiero Lambiase', role: 'Race Engineer', department: 'Engineering' },
  { id: 'EMP-3305', name: 'Hannah Schmitz', role: 'Strategy Engineer', department: 'Operations' }
];

const BLOG_POSTS = [
  {
    id: 1,
    title: "Philosophy of Speed: Reviewing 'The Art of Racing in the Rain'",
    excerpt: "Exploring the emotional depths and life lessons found in Garth Stein's masterpiece. Why it remains one of our most requested fiction titles.",
    author: "Literature Team",
    date: "May 12, 2026",
    category: "Book Spotlight",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
    url: "https://medium.com/search?q=The+Art+of+Racing+in+the+Rain+review"
  },
  {
    id: 2,
    title: "Documentary: The Official History of Formula 1",
    excerpt: "A visual and textual journey through the decades of F1. We analyze Maurice Hamilton's comprehensive archive available in our sports section.",
    author: "F1 Archivists",
    date: "May 08, 2026",
    category: "Sports Tech",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1541880860380-49667793ce83?auto=format&fit=crop&q=80&w=800",
    url: "https://medium.com/search?q=Formula+1+history+book+review"
  },
  {
    id: 3,
    title: "Mastering the Track: Speed Secrets by Ross Bentley",
    excerpt: "Professional driving techniques decoded. Read our summary of Bentley's technical guide to high-performance racing dynamics.",
    author: "Technical Hub",
    date: "May 02, 2026",
    category: "Technical",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800",
    url: "https://medium.com/search?q=Ross+Bentley+Speed+Secrets+review"
  }
];

const PROJECT_DOCUMENTS = [
  {
    id: "DOC-001",
    title: "Quantum Computing Hardware Architecture",
    author: "Dr. Elena Vance",
    type: "Research Paper",
    status: "Published",
    date: "Jan 12, 2026",
    fileSize: "4.2 MB",
    tags: ["Physics", "Hardware", "Future Tech"]
  },
  {
    id: "DOC-002",
    title: "Neural Network Optimization for Edge Devices",
    author: "Marcus Thorne",
    type: "Thesis",
    status: "Review",
    date: "Feb 15, 2026",
    fileSize: "2.8 MB",
    tags: ["AI", "Edge Computing", "Optimization"]
  },
  {
    id: "DOC-003",
    title: "Sustainable Urban Design in Megacities",
    author: "Sarah Jenkins",
    type: "Project Report",
    status: "Archived",
    date: "Mar 05, 2026",
    fileSize: "12.5 MB",
    tags: ["Urban Planning", "Sustainability", "Civil"]
  },
  {
    id: "DOC-004",
    title: "Blockchain for Decentralized Identity Management",
    author: "Alex Rivera",
    type: "Case Study",
    status: "Published",
    date: "Apr 20, 2026",
    fileSize: "1.5 MB",
    tags: ["Blockchain", "Security", "Web3"]
  }
];

const BRANCHES_DATA = [
  {
    category: "Computer & IT Branches",
    items: [
      "BCA (Bachelor of Computer Applications)",
      "MCA",
      "B.Sc Computer Science",
      "B.Tech Computer Science Engineering (CSE)",
      "Information Science Engineering (ISE)",
      "Artificial Intelligence & Machine Learning (AI/ML)",
      "Data Science",
      "Cyber Security",
      "Software Engineering",
      "Information Technology (IT)"
    ]
  },
  {
    category: "Commerce & Management",
    items: [
      "B.Com",
      "M.Com",
      "BBA",
      "MBA",
      "Banking & Finance",
      "Accounting",
      "Business Analytics",
      "Marketing Management",
      "Human Resource Management"
    ]
  }
];

function Layout({ books, user, onLogout }: { books: Book[], user: {name: string, role: string} | null, onLogout: () => void }) {
  const location = useLocation();
  const path = location.pathname.split('/')[1] || 'student';
  const portal = (path.charAt(0).toUpperCase() + path.slice(1)) as PortalType;
  const profile = PORTAL_PROFILES[portal] || PORTAL_PROFILES.Home;
  const displayName = user?.name || profile.name;
  const displayRole = user?.role || (portal === 'Student' ? 'Student' : portal === 'Employee' ? 'Employee' : 'Member');

  return (
    <div className="min-h-screen bg-lib-bg flex flex-col font-sans">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-[60] shadow-sm">
        <div className="flex items-center space-x-8">
          <NavLink to="/home" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-lib-primary p-1.5 rounded-md">
              <Library className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-lib-primary">
              Book<span className="text-lib-secondary">Bridge</span>
            </div>
          </NavLink>
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 md:pb-0 scroll-smooth max-w-[40vw] sm:max-w-none">
            {[
              { to: "/student", label: "Student Portal" },
              { to: "/blog", label: "Blog" },
              { to: "/documents", label: "Documents" },
              { to: "/branch", label: "Branch" },
              { to: "/employee", label: "Employee", badge: EMPLOYEES_DATA.length },
              { to: "/admin", label: "Admin" }
            ].map((link, i) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + (i * 0.05) }}
              >
                <NavLink 
                  to={link.to}
                  className={({ isActive }) => `px-3 py-1.5 whitespace-nowrap text-xs md:text-sm font-medium transition-all rounded-md flex items-center gap-1.5 ${isActive ? 'bg-lib-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  {link.label}
                  {link.badge !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${false ? 'bg-white text-lib-primary' : 'bg-lib-secondary text-white'}`}>
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              </motion.div>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center space-x-3 sm:space-x-6">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-slate-800">{displayName}</span>
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
              {displayRole} • Active Session
            </span>
          </div>
          <NavLink 
            to="/profile"
            className="w-10 h-10 rounded-full bg-lib-primary/10 border border-lib-primary/20 flex items-center justify-center font-bold text-lib-primary cursor-pointer hover:bg-lib-primary hover:text-white transition-all group relative"
          >
            {displayName[0]}
            <div className="absolute top-12 right-0 bg-white text-slate-900 border border-slate-200 p-4 shadow-xl w-64 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-[100] rounded-lg">
               <div className="flex items-center gap-3 mb-3 border-b border-slate-100 pb-3">
                 <div className="w-10 h-10 rounded-full bg-lib-primary flex items-center justify-center text-white text-lg font-bold">
                   {displayName[0]}
                 </div>
                 <div>
                   <p className="text-xs font-bold text-lib-primary uppercase tracking-widest">{portal} Profile</p>
                   <p className="font-bold text-sm text-slate-900">{displayName}</p>
                 </div>
               </div>
               <div className="space-y-1.5">
                 <p className="text-[11px] text-slate-500 flex justify-between"><span className="font-semibold uppercase tracking-tighter">Reference:</span> <span className="text-slate-900 font-bold">{profile.id}</span></p>
                 <p className="text-[11px] text-slate-500 flex justify-between"><span className="font-semibold uppercase tracking-tighter">Branch:</span> <span className="text-slate-900 font-bold">{profile.detail}</span></p>
               </div>
               <NavLink 
                to="/profile"
                className="w-full mt-3 bg-slate-900 text-white hover:bg-lib-primary transition-all py-2 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
               >
                 <User className="w-3 h-3" />
                 View Full Profile
               </NavLink>
               <button 
                onClick={onLogout}
                className="w-full mt-4 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
               >
                 <LogOut className="w-3.5 h-3.5" />
                 Sign Out Node
               </button>
            </div>
          </NavLink>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm active:scale-95 group font-bold text-xs uppercase tracking-widest"
            title="Terminate Secure Session"
          >
            <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="h-12 bg-white border-t border-slate-200 text-slate-500 text-[11px] flex items-center justify-between px-8 font-medium">
        <div className="flex items-center gap-4">
          <span>© 2026 BookBridge Global Solutions</span>
          <span className="hidden sm:inline text-slate-200">|</span>
          <span className="hidden sm:inline">Certified Smart Library System v1.0.0</span>
        </div>
        <div className="flex space-x-6">
          <span className="hidden md:inline flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Cloud Instance: <span className="text-emerald-600 font-bold uppercase tracking-widest text-[9px]">Active</span>
          </span>
          <span className="text-lib-primary font-bold">UTC: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
        </div>
      </footer>
    </div>
  );
}

function HomeView({ books }: { books: Book[] }) {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative h-[60vh] bg-lib-primary overflow-hidden flex items-center justify-center text-center px-6"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTagCyHAklcBgKRC4ZQy-UXbSmoBGGJctzlbQ&")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-4xl"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tighter mb-4 leading-none">
            Library Management <span className="text-lib-secondary">System</span>
          </h1>
          <p className="text-xl text-white font-medium max-w-2xl mx-auto mb-10">
            Your smart digital solution for managing knowledge and learning resources.
          </p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <NavLink 
              to="/student" 
              className="inline-flex items-center gap-3 bg-lib-secondary hover:bg-white hover:text-lib-secondary text-white font-black px-10 py-5 rounded-2xl transition-all shadow-2xl shadow-lib-secondary/20 group uppercase tracking-widest text-sm"
            >
              <motion.span whileHover={{ x: 5 }} className="flex items-center gap-3">
                Enter Student Portal
                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </motion.span>
            </NavLink>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative max-w-6xl mx-auto px-8 py-20 space-y-24 my-16 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10"
        style={{
          backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url("https://www.crownrelo.co.nz/wp-content/uploads/2023/09/WP_GlobalTrends.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        
        {/* Intro */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center max-w-3xl mx-auto relative z-10"
        >
          <p className="text-xl text-white leading-relaxed font-medium">
            Welcome to Library Management System, your smart digital solution for managing books, students, and library activities efficiently. Our platform is designed to simplify library operations and create a better reading experience for everyone.
          </p>
          <div className="h-px w-20 bg-white/20 mx-auto my-10"></div>
          <p className="text-lg text-white/70 leading-relaxed font-normal">
            We believe that libraries are the foundation of knowledge and learning. This system helps students, teachers, and librarians easily search, issue, return, and manage books in an organized way.
          </p>
        </motion.section>

        {/* Features & Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          {/* What We Provide */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/20 shadow-xl"
          >
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <span className="text-3xl">📚</span> What We Provide
            </h3>
            <ul className="grid grid-cols-1 gap-5">
              {[
                "Easy book searching and tracking",
                "Digital book issue and return system",
                "Student and employee management",
                "Secure admin dashboard",
                "Organized database for library records",
                "User-friendly interface for smooth access"
              ].map((item, i) => (
                <motion.li 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 text-white/90 group"
                >
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-lib-secondary group-hover:scale-125 transition-transform shrink-0" />
                  <span className="font-semibold text-base sm:text-lg">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Mission */}
          <motion.div 
             initial={{ opacity: 0, x: 30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="flex flex-col justify-center"
          >
            <div className="bg-lib-secondary/20 backdrop-blur-sm p-10 rounded-3xl border border-lib-secondary/30 mb-8 shadow-xl">
              <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="p-2 bg-lib-secondary rounded-lg">🎯</span>
                Our Mission
              </h3>
              <p className="text-white text-xl leading-relaxed italic font-medium">
                "Our mission is to modernize traditional libraries using technology and make knowledge accessible, fast, and organized for every learner."
              </p>
              <div className="mt-8 pt-8 border-t border-white/10 text-white/50 text-sm italic">
                Empowering the future of education, one book at a time.
              </div>
            </div>
          </motion.div>
        </div>

        {/* Why Choose Us & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          {/* Vision */}
           <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-lib-primary/20 backdrop-blur-sm p-10 rounded-3xl border border-white/10 flex flex-col justify-center shadow-xl"
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-3xl">📖</span> Our Vision
            </h3>
            <p className="text-white/90 text-lg leading-relaxed italic mb-8">
              "To create a smart digital library environment where technology and education work together to support learning and innovation."
            </p>
            <div className="text-center pt-8 border-t border-white/10">
               <p className="text-lib-secondary font-bold text-base italic">“A library is not just a collection of books, but a gateway to endless knowledge.”</p>
            </div>
          </motion.div>

          {/* Why Choose Us */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-sm p-10 rounded-3xl border border-white/10 shadow-xl"
          >
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <span className="text-3xl">🌟</span> Why Choose Us?
            </h3>
            <ul className="space-y-5">
              {[
                "Simple and attractive design",
                "Fast and efficient management",
                "Saves time and reduces paperwork",
                "Secure and reliable system",
                "Suitable for schools, colleges, and institutions"
              ].map((item, i) => (
                <motion.li 
                  key={i} 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 text-white/80"
                >
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-lib-secondary shrink-0" />
                  <span className="font-semibold text-base">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Core Pillars */}
        <div className="pt-24 border-t border-white/10 relative z-10">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Unity', desc: 'Centralized management across multiple branch nodes with real-time syncing.', icon: <Library className="w-8 h-8"/> },
                { title: 'Speed', desc: 'Optimized search and retrieval protocols for zero-latency discovery.', icon: <Search className="w-8 h-8"/> },
                { title: 'Security', desc: 'Enterprise-grade encryption for all user profiles and transaction logs.', icon: <Settings className="w-8 h-8"/> }
              ].map((pill, i) => (
                <div key={i} className="p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 transition-all group cursor-default">
                   <div className="w-16 h-16 bg-white/10 text-white rounded-xl flex items-center justify-center mb-8 group-hover:bg-lib-secondary group-hover:scale-110 transition-all shadow-lg">
                      {pill.icon}
                   </div>
                   <h3 className="text-2xl font-bold text-white mb-4">{pill.title}</h3>
                   <p className="text-white/60 text-base leading-relaxed">{pill.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </motion.div>
    </div>
  );
}

function BranchDirectoryView({ books }: { books: Book[] }) {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const filteredBooks = selectedBranch 
    ? books.filter(b => b.branch === selectedBranch) 
    : [];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <NavLink 
            to="/home" 
            className="p-2.5 bg-white hover:bg-lib-primary/10 text-slate-400 hover:text-lib-primary rounded-xl transition-all border border-slate-200 shadow-sm group" 
            title="Return to Home"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </NavLink>
        </div>
        <div className="mb-10 text-center">
          <span className="px-3 py-1 bg-lib-primary/10 text-lib-primary rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">Institutional Directory</span>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            {selectedBranch ? (
              <>Repository for <span className="text-lib-primary">{selectedBranch}</span></>
            ) : (
              <>Branch Node <span className="text-lib-primary">Taxonomy</span></>
            )}
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            {selectedBranch 
              ? `Displaying all resources verified for the ${selectedBranch} curriculum.`
              : "Categorized listing of all connected academic and operational branches."
            }
          </p>
          {selectedBranch && (
            <button 
              onClick={() => setSelectedBranch(null)}
              className="mt-4 text-xs font-bold text-lib-primary uppercase tracking-widest hover:underline flex items-center gap-1 mx-auto"
            >
              <ArrowLeft className="w-3 h-3" /> Back to Taxonomy
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!selectedBranch ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {BRANCHES_DATA.map((category, idx) => (
                <motion.div 
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white border-t-4 border-lib-secondary p-8 rounded-lg shadow-sm border-x border-b border-slate-200"
                >
                  <h2 className="text-xl font-bold text-lib-primary mb-6 flex items-center gap-2">
                    <div className="w-2 h-6 bg-lib-secondary rounded-full"></div>
                    {category.category}
                  </h2>
                  <div className="space-y-1">
                    {category.items.map((item, i) => (
                      <div 
                        key={i} 
                        onClick={() => setSelectedBranch(item)}
                        className="flex items-start gap-3 group cursor-pointer p-3 hover:bg-slate-50 rounded-md transition-colors"
                      >
                        <ChevronRight className="w-4 h-4 text-lib-secondary mt-0.5 shrink-0 group-hover:translate-x-1 transition-transform" />
                        <span className="text-sm font-semibold text-slate-700 group-hover:text-lib-primary transition-colors">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-8"
            >
              {filteredBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredBooks.map((book, index) => (
                    <BookCard 
                      key={book.id} 
                      book={book} 
                      portal="Branch" 
                      onEdit={() => {}} 
                      onDelete={() => {}} 
                      index={index} 
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl p-16 text-center shadow-sm">
                  <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No Records Found</h3>
                  <p className="text-slate-500 max-w-xs mx-auto mb-8">We couldn't find any documents explicitly tagged for the <span className="font-bold text-slate-700">{selectedBranch}</span> repository.</p>
                  <button 
                    onClick={() => setSelectedBranch(null)}
                    className="lib-btn-primary"
                  >
                    View All Branches
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {!selectedBranch && (
          <div className="mt-12 p-6 bg-lib-primary/5 border border-lib-primary/10 rounded-lg text-center">
            <p className="text-xs font-bold text-lib-primary uppercase tracking-widest">System Note</p>
            <p className="text-sm text-slate-600 mt-1">All branches listed above are actively syncing with the central BookBridge knowledge repository.</p>
          </div>
        )}
      </div>
    </div>
  );
}


// Dummy intermediate component to satisfy the route structure
function CatalogPage({ portal, books, onRefresh }: { portal: PortalType, books: Book[], onRefresh: () => void }) {
  return null; // The layout already renders the CatalogView
}

function LoginView({ onLogin }: { onLogin: (name: string, role: string) => void }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Student');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [branch, setBranch] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    onLogin(fullName || "Guest User", role);
    navigate('/home');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-lg"
      >
        <motion.div variants={itemVariants} className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2 leading-none lowercase">
            Book<span className="text-lib-secondary">Bridge</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Secure Access Portal</p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-12 shadow-xl relative"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Account Role</label>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setRole('Student')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all font-bold text-[10px] uppercase tracking-widest ${
                      role === 'Student' 
                        ? 'border-lib-primary bg-lib-primary/5 text-lib-primary shadow-sm' 
                        : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    Student
                  </button>
                  <button 
                    type="button"
                    onClick={() => setRole('Employee')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all font-bold text-[10px] uppercase tracking-widest ${
                      role === 'Employee' 
                        ? 'border-lib-primary bg-lib-primary/5 text-lib-primary shadow-sm' 
                        : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    Employee
                  </button>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Full Identity Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="ENTER FULL NAME"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-lib-primary/20 focus:border-lib-primary transition-all tracking-wider"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Authentication Email</label>
                <input 
                  required
                  type="email" 
                  placeholder="EMAIL ADDRESS"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-lib-primary/20 focus:border-lib-primary transition-all tracking-wider"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Mobile Access Key</label>
                <div className="flex gap-2">
                  <div className="relative">
                    <select 
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="h-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-8 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-lib-primary/20 focus:border-lib-primary transition-all appearance-none cursor-pointer"
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+61">🇦🇺 +61</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+81">🇯🇵 +81</option>
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  </div>
                  <input 
                    required
                    type="tel" 
                    placeholder="00000 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-lib-primary/20 focus:border-lib-primary transition-all tracking-wider"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Assignee Branch</label>
                <select 
                  required
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-lib-primary/20 focus:border-lib-primary transition-all tracking-wider appearance-none"
                >
                  <option value="" disabled>SELECT BRANCH</option>
                  <option value="Main Library">Main Library</option>
                  <option value="Science Wing">Science Wing</option>
                  <option value="Arts & Humanities">Arts & Humanities</option>
                  <option value="Digital Archive">Digital Archive</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Student DOB</label>
                <input 
                  required
                  type="date" 
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-lib-primary/20 focus:border-lib-primary transition-all tracking-wider"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Security Core Key</label>
                <div className="relative">
                  <input 
                    required
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 pr-12 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-lib-primary/20 focus:border-lib-primary transition-all tracking-widest"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-lib-primary focus:ring-lib-primary" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Remember Identity</span>
              </label>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-lib-primary hover:bg-slate-900 text-white font-black py-4 rounded-xl text-xs uppercase tracking-[0.2em] transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Initializing...
                </>
              ) : (
                'Secure Sign In'
              )}
            </button>
          </form>
        </motion.div>

        <motion.p variants={itemVariants} className="text-center mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
          BookBridge Global Access Repository © 2026
        </motion.p>
      </motion.div>
    </div>
  );
}

function BlogView({ books }: { books: Book[] }) {
  const [displayCount, setDisplayCount] = useState(6);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Static featured posts for immediate visibility
  const featuredPosts = BLOG_POSTS.map(post => ({
    ...post,
    type: 'featured',
    videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(post.title)}`
  }));

  // Generate blog-like objects from actual books
  const dynamicBlogPosts = books.map(book => ({
    id: `book-blog-${book.id}`,
    title: `Technical Review: ${book.title}`,
    excerpt: `A critical analysis of "${book.title}" by ${book.author}. This asset categorized under ${book.genre} forms a key part of our ${book.branch || 'central'} library infrastructure.`,
    author: "Library Curator",
    date: "Real-time Sync",
    category: book.genre,
    readTime: "4 min read",
    image: book.coverImage || "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800",
    url: `https://medium.com/search?q=${encodeURIComponent(book.title + ' ' + book.author + ' book review')}`,
    videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(book.title + ' ' + book.author + ' review')}`,
    type: 'dynamic'
  }));

  const allPosts = [...featuredPosts, ...dynamicBlogPosts];
  const visiblePosts = allPosts.slice(0, displayCount);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-8 py-10 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex items-start gap-8">
            <NavLink 
              to="/home" 
              className="p-3 bg-slate-50 hover:bg-lib-primary/10 text-slate-400 hover:text-lib-primary rounded-2xl transition-all border border-slate-200 shadow-sm group mt-1" 
              title="Return to Home"
            >
              <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </NavLink>
            <div>
              <span className="text-[10px] font-bold text-lib-primary uppercase tracking-[0.3em] mb-3 block">Digital Metadata Hub</span>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-4">BookBridge <span className="text-lib-primary">Blog Feed</span></h1>
              <p className="text-slate-500 text-lg max-w-2xl leading-relaxed font-medium">
                Sourced blog entries and technical video reviews for every asset currently registered in our database.
              </p>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
             <button 
              onClick={() => setViewMode('grid')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-white text-lib-primary shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
             >
               Detailed Grid
             </button>
             <button 
              onClick={() => setViewMode('list')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-white text-lib-primary shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
             >
               Quick Links
             </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          {visiblePosts.length > 0 ? (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {visiblePosts.map((post, index) => (
                    <motion.article 
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.05, 0.5) }}
                      className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 flex flex-col group transition-all h-full hover:shadow-2xl hover:-translate-y-1"
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black text-lib-primary uppercase tracking-widest leading-none shadow-sm flex items-center gap-1.5">
                          {post.type === 'featured' ? <CheckCircle2 className="w-3 h-3" /> : <Library className="w-3 h-3" />}
                          {post.category}
                        </div>
                      </div>
                      <div className="p-8 flex flex-col flex-1">
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-50">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-black text-lib-primary uppercase">
                            {post.author.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 leading-none mb-1.5">{post.author}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.date}</p>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-lib-primary transition-colors min-h-[3rem]">
                          {post.title}
                        </h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-8 line-clamp-3 font-medium">
                          {post.excerpt}
                        </p>
                        <div className="mt-auto space-y-3">
                          <a 
                            href={post.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full bg-slate-900 hover:bg-lib-primary text-white text-center py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group/btn"
                          >
                            <MessageSquare className="w-4 h-4" />
                            VIEW MEDIUM BLOG
                            <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover/btn:opacity-100 transition-opacity" />
                          </a>
                          <a 
                            href={post.videoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full bg-white border-2 border-slate-100 hover:border-red-500 text-slate-900 hover:text-red-600 text-center py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group/vid"
                          >
                            <Video className="w-4 h-4 text-red-500 group-hover/vid:scale-110 transition-transform" />
                            WATCH VIDEO REVIEW
                          </a>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                   <div className="bg-slate-50 px-8 py-4 border-b border-slate-200 flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Direct Resource Access Index</span>
                      <span className="text-[10px] font-black text-lib-primary uppercase tracking-[0.3em]">{dynamicBlogPosts.length} Registered Links</span>
                   </div>
                   <div className="divide-y divide-slate-100">
                      {visiblePosts.map((post, index) => (
                        <motion.div 
                          key={post.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="px-8 py-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                        >
                           <div className="flex items-center gap-6">
                              <div className="w-12 h-16 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200 group-hover:scale-105 transition-transform">
                                 <img src={post.image} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                              </div>
                              <div>
                                 <h4 className="font-bold text-slate-900 group-hover:text-lib-primary transition-colors">{post.title}</h4>
                                 <p className="text-xs text-slate-500 font-medium uppercase tracking-tight mt-1">{post.category} • Internal Archive Reference</p>
                              </div>
                           </div>
                           <div className="flex gap-3">
                              <a 
                                href={post.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="px-5 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-lib-primary transition-all flex items-center gap-2"
                              >
                                Blog <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                              <a 
                                href={post.videoUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:border-red-500 hover:text-red-600 transition-all flex items-center gap-2"
                              >
                                Video <Play className="w-3.5 h-3.5" />
                              </a>
                           </div>
                        </motion.div>
                      ))}
                   </div>
                </div>
              )}

              {displayCount < dynamicBlogPosts.length && (
                <div className="mt-20 text-center">
                  <button 
                    onClick={() => setDisplayCount(prev => prev + 6)}
                    className="bg-slate-900 text-white font-black px-12 py-5 rounded-2xl hover:bg-lib-primary transition-all active:scale-95 shadow-2xl shadow-lib-primary/20 group uppercase tracking-widest text-sm"
                  >
                    SYNC NEXT BATCH
                    <Plus className="w-5 h-5 ml-3 inline-block group-hover:rotate-90 transition-transform" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white border border-dashed border-slate-300 rounded-[3rem] p-32 text-center shadow-inner">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100">
                  <Search className="w-10 h-10 text-slate-300" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Metadata Feed Empty</h2>
                <p className="text-slate-500 text-lg max-w-sm mx-auto font-medium leading-relaxed">
                  Register assets in the student or admin portals to generate a dynamic stream of technical insights and external blog references.
                </p>
                <NavLink to="/admin" className="mt-10 inline-flex items-center gap-3 text-lib-primary font-black uppercase tracking-widest text-xs hover:gap-5 transition-all">
                  Access Portal Terminal <ArrowLeft className="w-4 h-4 rotate-180" />
                </NavLink>
            </div>
          )}

          <div className="mt-32 bg-slate-900 rounded-[3rem] p-16 text-white relative overflow-hidden group shadow-2xl">
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
              <div className="max-w-xl text-center lg:text-left">
                <span className="text-[10px] font-black text-lib-secondary uppercase tracking-[0.4em] mb-4 block">Intelligence Network</span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 leading-none">Internal BookBridge <span className="text-lib-secondary">Dispatch</span></h2>
                <p className="text-slate-400 text-lg font-medium leading-relaxed">Join the neural network of library professionals and dedicated researchers. Real-time updates delivered to your node.</p>
              </div>
              <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="IDENTITY@BRANCH.NODE" 
                  className="bg-white/5 border border-white/10 rounded-2xl px-8 py-5 w-full lg:w-80 focus:outline-none focus:ring-2 focus:ring-lib-secondary/50 placeholder:text-slate-600 font-bold text-sm tracking-widest text-center lg:text-left"
                />
                <button className="bg-lib-secondary hover:bg-white hover:text-lib-secondary text-white font-black px-12 py-5 rounded-2xl transition-all shadow-2xl shadow-lib-secondary/30 whitespace-nowrap active:scale-95 uppercase tracking-widest text-sm">
                  Initialize Sync
                </button>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lib-primary/20 blur-[150px] -mr-64 -mt-64 rounded-full group-hover:bg-lib-secondary/20 transition-colors duration-1000"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentsView() {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-4">
             <NavLink 
              to="/home" 
              className="p-3 bg-white hover:bg-lib-primary/10 text-slate-400 hover:text-lib-primary rounded-2xl transition-all border border-slate-200 shadow-sm group" 
              title="Return to Home"
            >
              <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </NavLink>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-none mb-2">Project <span className="text-lib-primary text-3xl font-medium block sm:inline mt-2 sm:mt-0 uppercase tracking-tighter sm:normal-case">Documents</span></h1>
              <div className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-lib-primary animate-pulse"></span>
                 <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Secure Document Repository Active</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROJECT_DOCUMENTS.map((doc, idx) => (
            <motion.div 
              key={doc.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-lib-primary/10 rounded-2xl flex items-center justify-center text-lib-primary group-hover:bg-lib-primary group-hover:text-white transition-all">
                    <FileText className="w-8 h-8" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    doc.status === 'Published' ? 'bg-emerald-100 text-emerald-600' : 
                    doc.status === 'Review' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {doc.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-lib-primary transition-colors">{doc.title}</h3>
                <p className="text-sm text-slate-500 font-medium mb-6">By {doc.author} • {doc.type}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {doc.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Uploaded</p>
                  <p className="text-xs font-bold text-slate-900">{doc.date}</p>
                </div>
                <button className="flex items-center gap-2 bg-slate-900 hover:bg-lib-primary text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-lg active:scale-95 group/dl">
                  Download <span className="opacity-40">{doc.fileSize}</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover/dl:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileView({ user, onLogout }: { user: {name: string, role: string} | null, onLogout: () => void }) {
  const profile = PORTAL_PROFILES.Profile;
  const displayName = user?.name || profile.name;
  const displayRole = user?.role || "Institutional Member";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-12"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-4">
             <NavLink 
              to="/home" 
              className="p-3 bg-white hover:bg-lib-primary/10 text-slate-400 hover:text-lib-primary rounded-2xl transition-all border border-slate-200 shadow-sm group" 
              title="Return to Home"
            >
              <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </NavLink>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-none mb-2">Member <span className="text-lib-primary text-3xl font-medium block sm:inline mt-2 sm:mt-0 uppercase tracking-tighter sm:normal-case">Profile</span></h1>
              <div className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                 <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Secure Session Active: {displayName}</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={onLogout}
            className="hidden sm:flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-xl shadow-red-600/20 active:scale-95 group uppercase tracking-widest text-xs"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            Terminate Session
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-slate-100 relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-80 h-80 bg-lib-primary/5 blur-[100px] rounded-full -mr-40 -mt-40"></div>
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-lib-secondary/5 blur-[80px] rounded-full -ml-32 -mb-32"></div>
               
               <div className="flex flex-col sm:flex-row items-center sm:items-start gap-12 relative z-10">
                  <motion.div 
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    className="relative group cursor-pointer"
                  >
                     <div className="w-40 h-40 rounded-[3rem] bg-lib-primary flex items-center justify-center text-white text-6xl font-black shadow-2xl shadow-lib-primary/20 transition-transform duration-500">
                        {displayName[0]}
                     </div>
                     <button className="absolute -bottom-2 -right-2 bg-white p-4 rounded-3xl shadow-2xl border border-slate-100 text-lib-primary hover:bg-lib-primary hover:text-white transition-all scale-110 active:scale-95 group/cam">
                        <Camera className="w-6 h-6 group-hover/cam:rotate-12 transition-transform" />
                     </button>
                  </motion.div>
                  <div className="text-center sm:text-left pt-4">
                     <div className="flex items-center gap-3 justify-center sm:justify-start mb-4">
                        <span className="px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">Authority Level 4</span>
                        <span className="text-slate-200 text-xl font-thin hidden sm:inline">/</span>
                        <span className="text-lib-primary font-black text-xs uppercase tracking-[0.2em] italic">{displayRole}</span>
                     </div>
                     <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter leading-none">{displayName}</h2>
                     <p className="text-slate-400 font-mono text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-3 justify-center sm:justify-start">
                        <Lock className="w-4 h-4 text-slate-300" /> System Identifier: {profile.id}
                     </p>
                  </div>
               </div>

               <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                  {[
                    { label: "Communication Node", val: profile.email, icon: <Mail className="w-4 h-4" /> },
                    { label: "Voice Access Point", val: profile.phone, icon: <Phone className="w-4 h-4" /> },
                    { label: "Registration Epoch", val: profile.joinDate, icon: <Calendar className="w-4 h-4" /> },
                    { label: "Physical Cluster", val: profile.location, icon: <MapPin className="w-4 h-4" /> }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + (i * 0.1) }}
                      className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all group/card cursor-default"
                    >
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                         <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm text-lib-primary">{item.icon}</div> {item.label}
                      </p>
                      <p className="text-lg font-black text-slate-800 tracking-tight">{item.val}</p>
                    </motion.div>
                  ))}
               </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100"
            >
               <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-4">
                  <div className="w-12 h-12 bg-lib-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-lib-primary/20"><Settings className="w-6 h-6" /></div>
                  Security Protocols
               </h3>
               <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:bg-white hover:shadow-lg transition-all cursor-pointer">
                     <div className="flex items-center gap-6">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></div>
                        <div>
                           <span className="text-sm font-black text-slate-800 uppercase tracking-widest block">Two-Factor Authentication</span>
                           <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">Status: Reinforced</span>
                        </div>
                     </div>
                     <div className="w-14 h-8 bg-emerald-500 rounded-full relative shadow-inner">
                        <div className="absolute right-1 top-1 w-6 h-6 bg-white rounded-full shadow-md"></div>
                     </div>
                  </div>
                  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 opacity-60 grayscale">
                     <div className="flex items-center gap-6">
                        <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                        <div>
                           <span className="text-sm font-black text-slate-800 uppercase tracking-widest block">Biometric Metadata Sync</span>
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Status: Offline</span>
                        </div>
                     </div>
                     <div className="w-14 h-8 bg-slate-300 rounded-full relative">
                        <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md"></div>
                     </div>
                  </div>
                  <div className="pt-6">
                     <button className="w-full h-16 bg-slate-900 hover:bg-lib-primary text-white font-black rounded-2xl transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] uppercase tracking-[0.2em] text-xs">
                        Reset Advanced Encryption Key
                     </button>
                  </div>
               </div>
            </motion.div>
          </div>

          {/* Activity/Stats */}
          <div className="space-y-8">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-48 h-48 bg-lib-primary/20 blur-[60px] rounded-full -mr-24 -mt-24 group-hover:bg-lib-secondary/20 transition-all duration-1000"></div>
               <h3 className="text-[10px] font-black text-lib-secondary uppercase tracking-[0.4em] mb-12">Performance Analytics</h3>
               <div className="space-y-12">
                  <div className="flex items-center gap-8 relative">
                     <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-inner border border-white/5">📚</div>
                     <div>
                        <p className="text-4xl font-black leading-none mb-2 tracking-tighter italic">12</p>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Active Requests</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-8 relative">
                     <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-inner border border-white/5">⭐</div>
                     <div>
                        <p className="text-4xl font-black leading-none mb-2 tracking-tighter italic text-lib-secondary">9.8</p>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">System Trust Index</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-8 relative">
                     <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-inner border border-white/5">⏱️</div>
                     <div>
                        <p className="text-4xl font-black leading-none mb-2 tracking-tighter italic text-lib-primary">240h</p>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Repository Uptime</p>
                     </div>
                  </div>
               </div>
               <div className="mt-16 pt-10 border-t border-white/10">
                  <button className="w-full h-14 bg-white/10 hover:bg-white text-white hover:text-slate-900 font-black rounded-2xl text-[10px] uppercase tracking-widest border border-white/10 hover:border-white transition-all active:scale-95">
                     Export Node Logs (.txt)
                  </button>
               </div>
            </div>

            <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10 pb-6 border-b border-slate-50">Credentials Interface</h3>
               <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-6 p-6 bg-slate-50/50 rounded-3xl group cursor-pointer hover:bg-white hover:shadow-2xl transition-all border border-transparent hover:border-slate-100">
                     <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm group-hover:scale-110 group-hover:bg-lib-primary group-hover:text-white transition-all"><CreditCard className="w-7 h-7 text-lib-primary group-hover:text-white transition-colors" /></div>
                     <div>
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Digital Sync Card</p>
                        <p className="text-[10px] text-emerald-600 font-black uppercase tracking-tighter mt-1 italic">Authorized</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-6 p-6 bg-slate-50/50 rounded-3xl group cursor-pointer hover:bg-white hover:shadow-2xl transition-all border border-transparent hover:border-slate-100 opacity-60">
                     <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm group-hover:scale-110 transition-all"><FileText className="w-7 h-7 text-slate-400" /></div>
                     <div>
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Technical CV Registry</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter mt-1 italic">Pending Meta-Sync</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CatalogView({ portal, books, onRefresh }: { portal: PortalType, books: Book[], onRefresh: () => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [detailsBook, setDetailsBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const user = PORTAL_PROFILES[portal];

  const handleSaveBook = async (bookData: Omit<Book, 'id'>) => {
    if (editingBook) {
      await api.updateBook(editingBook.id, bookData);
    } else {
      await api.createBook(bookData);
    }
    onRefresh();
    closeModal();
  };

  const handleDeleteBook = async (id: string) => {
    if (confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      await api.deleteBook(id);
      onRefresh();
    }
  };

  const openModal = (book: Book | null = null) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingBook(null);
    setIsModalOpen(false);
  };

  const openDetails = (book: Book) => {
    setDetailsBook(book);
  };

  const closeDetails = () => {
    setDetailsBook(null);
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const detailsIndex = detailsBook ? filteredBooks.findIndex(b => b.id === detailsBook.id) : -1;

  const handleDetailsNext = () => {
    if (detailsIndex < filteredBooks.length - 1) {
      setDetailsBook(filteredBooks[detailsIndex + 1]);
    }
  };

  const handleDetailsPrev = () => {
    if (detailsIndex > 0) {
      setDetailsBook(filteredBooks[detailsIndex - 1]);
    }
  };

  return (
    <>
      <div className="bg-white border-b border-slate-200 px-8 py-6 shrink-0 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <NavLink 
              to="/home" 
              className="p-2.5 bg-slate-50 hover:bg-lib-primary/10 text-slate-400 hover:text-lib-primary rounded-xl transition-all border border-slate-200 shadow-sm group" 
              title="Return to Home"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </NavLink>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-lib-primary/10 text-lib-primary text-[10px] font-bold rounded uppercase tracking-widest">Global Terminal</span>
                <span className="text-slate-300">•</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">Modern problems need smart library solutions</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
               {portal} Managed <span className="text-slate-400 font-medium">Better</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search catalog resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 text-sm focus:ring-2 focus:ring-lib-primary/20 focus:border-lib-primary outline-none transition-all"
              />
            </div>
            {(portal === 'Employee' || portal === 'Admin' || portal === 'Branch') && (
              <button 
                onClick={() => openModal()}
                className="lib-btn-primary whitespace-nowrap h-11"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Record
              </button>
            )}
          </div>
        </div>

        {portal === 'Employee' && (
          <div className="mt-8 px-8">
            <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden">
               <div className="relative z-10">
                  <span className="text-[10px] font-bold text-lib-secondary uppercase tracking-[0.2em] mb-2 block">Personnel Command</span>
                  <h3 className="text-2xl font-black tracking-tight mb-2">Operational Team Strength: {EMPLOYEES_DATA.length}</h3>
                  <p className="text-slate-400 text-sm max-w-md">The BookBridge system is currently managed by {EMPLOYEES_DATA.length} authorized personnel across various departments.</p>
               </div>
               <div className="relative z-10 flex gap-4 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                  {EMPLOYEES_DATA.slice(0, 3).map((emp, i) => (
                    <div key={i} className="px-5 py-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm min-w-[160px]">
                       <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">{emp.role}</p>
                       <p className="text-sm font-bold text-white">{emp.name}</p>
                    </div>
                  ))}
               </div>
               <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-lib-secondary/10 blur-[80px] rounded-full"></div>
            </div>
          </div>
        )}

        {/* Profile Details Display */}
        <motion.div 
          key={portal}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-6 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap items-center justify-between gap-6 shrink-0"
        >
          <div className="flex items-center gap-4">
            <div className="bg-lib-primary w-12 h-12 rounded-lg flex items-center justify-center shadow-sm">
              <Library className="w-6 h-6 text-white" />
            </div>
            <div>
               <span className="text-[10px] font-bold text-lib-primary uppercase tracking-widest opacity-80">{portal} Entity Details</span>
               <h2 className="text-2xl font-bold tracking-tight text-slate-900 leading-none">{user.name}</h2>
            </div>
          </div>
          
          <div className="flex gap-8 sm:gap-12 flex-wrap">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                {portal === 'Student' ? 'Registration Number' : 'ID Number'}
              </span>
              <p className="text-sm font-bold text-slate-900 font-mono italic">{user.id}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                {portal === 'Student' ? 'Academic Branch' : 'Department/Unit'}
              </span>
              <p className="text-sm font-bold text-slate-900 uppercase italic">{user.detail}</p>
            </div>
            {portal === 'Student' && (
              <>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Date of Birth</span>
                  <p className="text-sm font-bold text-slate-900 italic">{user.dob}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Phone Number</span>
                  <p className="text-sm font-bold text-slate-900 italic">{user.phone}</p>
                </div>
              </>
            )}
          </div>
          <div className="ml-auto hidden xl:flex items-center gap-6 border-l border-slate-200 pl-8">
             <div className="text-center">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Database Size</span>
               <p className="text-lg font-bold text-lib-primary leading-none">{books.length}</p>
             </div>
             <div className="text-center">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Results</span>
               <p className="text-lg font-bold text-lib-secondary leading-none">{filteredBooks.length}</p>
             </div>
          </div>
        </motion.div>
      </div>

      <div className="flex-1 p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 bg-slate-50 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {filteredBooks.map((book, index) => (
            <BookCard 
              key={book.id} 
              book={book} 
              portal={portal}
              onEdit={() => openModal(book)}
              onDelete={() => handleDeleteBook(book.id)}
              onViewDetails={() => openDetails(book)}
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <BookModal 
            isOpen={isModalOpen} 
            onClose={closeModal} 
            onSave={handleSaveBook} 
            initialData={editingBook}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {detailsBook && (
          <BookDetailsModal 
            book={detailsBook} 
            onClose={closeDetails} 
            onNext={detailsIndex < filteredBooks.length - 1 ? handleDetailsNext : undefined}
            onPrev={detailsIndex > 0 ? handleDetailsPrev : undefined}
            portal={portal}
          />
        )}
      </AnimatePresence>
    </>
  );
}


interface BookCardProps {
  key?: string | number;
  book: Book;
  portal: PortalType;
  onEdit: () => void;
  onDelete: (id: string) => void | Promise<void>;
  onViewDetails?: () => void;
  index: number;
}

function BookCard({ book, portal, onEdit, onDelete, onViewDetails, index }: BookCardProps) {
  const getGradient = (genre: string) => {
    switch (genre.toLowerCase()) {
      case 'technical': return 'from-lib-primary to-slate-800';
      case 'history': return 'from-stone-600 to-stone-900';
      case 'fiction': return 'from-lib-secondary to-orange-900';
      case 'biography': return 'from-emerald-700 to-emerald-900';
      case 'sports': return 'from-red-600 to-red-900';
      default: return 'from-slate-500 to-slate-800';
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ 
        duration: 0.4, 
        delay: Math.min(index * 0.05, 0.4),
        ease: [0.23, 1, 0.32, 1] 
      }}
      whileHover={{ y: -8 }}
      className="lib-card group flex flex-col cursor-pointer transition-shadow"
      onClick={onViewDetails}
    >
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-500 text-[9px] px-2 py-0.5 font-bold rounded border border-slate-200 z-10 shadow-sm leading-none">
        U-ID: {book.id.slice(-6).toUpperCase()}
      </div>
      
      <div className="h-48 bg-slate-100 mb-5 overflow-hidden relative rounded-md border border-slate-100 shadow-inner">
        {book.coverImage ? (
          <div className="absolute inset-0 overflow-hidden">
            <img 
              src={book.coverImage} 
              alt={book.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className={`absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity`} />
          </div>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(book.genre)} flex items-center justify-center p-6 transition-transform duration-700 group-hover:scale-105`}>
            <Library className="absolute top-4 left-4 w-5 h-5 text-white/20" />
          </div>
        )}
        
        <div className="absolute inset-0 p-6 flex items-center justify-center pointer-events-none">
          <div className="text-white font-bold text-center text-sm border-2 border-white/20 p-4 leading-snug rounded bg-black/20 backdrop-blur-[2px] shadow-lg max-w-[85%] transform transition-transform group-hover:scale-110">
            {book.title}
          </div>
        </div>
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          <motion.div 
            animate={book.status === 'Available' ? { opacity: [1, 0.6, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            className={`px-2.5 py-1 text-[9px] uppercase font-bold tracking-widest rounded shadow-sm ${
              book.status === 'Available' ? 'bg-emerald-500 text-white' : 
              book.status === 'Reserved' ? 'bg-lib-secondary text-white' : 'bg-slate-700 text-white'
            }`}
          >
            {book.status}
          </motion.div>
          <div className="bg-white/90 backdrop-blur-md px-2 py-1 text-[9px] uppercase font-bold tracking-widest text-slate-700 rounded shadow-sm border border-white">
            VOL: {book.quantity}
          </div>
        </div>
        {book.branch && (
          <div className="absolute top-3 left-3 bg-lib-primary/80 backdrop-blur-sm text-white text-[8px] px-2 py-0.5 font-bold rounded uppercase tracking-wider z-10 border border-white/20">
            {book.branch}
          </div>
        )}
      </div>

      <div className="mb-6 flex-grow">
        <span className="text-[10px] font-bold text-lib-primary uppercase tracking-widest mb-1.5 block opacity-80">{book.genre}</span>
        <h3 className="font-bold text-base leading-tight text-slate-900 transition-colors group-hover:text-lib-primary line-clamp-2 min-h-[2.5rem]">
          {book.title}
        </h3>
        <p className="text-[11px] text-slate-500 font-medium uppercase tracking-tight mt-2 italic">
          BY <span className="text-slate-800 font-semibold uppercase not-italic">{book.author}</span>
        </p>
      </div>

      <div className="mt-auto flex gap-2 pt-4 border-t border-slate-100">
        <button 
          onClick={(e) => { e.stopPropagation(); onViewDetails?.(); }} 
          className={`lib-btn-primary !py-2.5 !text-[10px] tracking-widest group/btn !rounded-md ${
            (portal === 'Employee' || portal === 'Admin' || portal === 'Branch') ? 'flex-[2]' : 'w-full'
          }`}
        >
          View Full Repository Data
          <ChevronRight className="w-3 h-3 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </button>

        {(portal === 'Employee' || portal === 'Admin' || portal === 'Branch') && (
          <div className="flex flex-1 gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="p-2.5 bg-slate-100 hover:bg-lib-primary hover:text-white text-slate-600 rounded-md transition-all flex-1 flex items-center justify-center border border-slate-200 shadow-sm"
              title="Edit Record"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(book.id); }}
              className="p-2.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-md transition-all flex-1 flex items-center justify-center border border-red-100 shadow-sm"
              title="Delete Record"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function BookDetailsModal({ book, onClose, onNext, onPrev, portal }: { 
  book: Book, 
  onClose: () => void, 
  onNext?: () => void, 
  onPrev?: () => void,
  portal: PortalType 
}) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRequest = () => {
    setIsSubmitted(true);
  };

  useEffect(() => {
    setIsSubmitted(false);
  }, [book.id]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white w-full max-w-2xl shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-[400px]"
      >
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div 
              key="details"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col md:flex-row w-full"
            >
              <div className="w-full md:w-2/5 aspect-[3/4] md:aspect-auto bg-slate-200 relative">
                {book.coverImage ? (
                  <img 
                    src={book.coverImage} 
                    alt={book.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white/20">
                    <Library className="w-20 h-20" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                   <div className={`px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded shadow-lg ${
                      book.status === 'Available' ? 'bg-emerald-500 text-white' : 
                      book.status === 'Reserved' ? 'bg-lib-secondary text-white' : 'bg-slate-700 text-white'
                    }`}>
                      {book.status}
                    </div>
                </div>
              </div>

              <div className="flex-1 p-8 md:p-10 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="pr-8">
                    <span className="text-[10px] font-bold text-lib-primary uppercase tracking-[0.2em] mb-2 block">{book.genre}</span>
                    <h2 className="text-3xl font-extrabold text-slate-900 leading-tight tracking-tighter">
                      {book.title}
                    </h2>
                  </div>
                  <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 -mr-2 transition-colors shrink-0">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex gap-2 mb-6">
                  {onPrev && (
                    <button 
                      onClick={onPrev}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-all flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      Prev Part
                    </button>
                  )}
                  {onNext && (
                    <button 
                      onClick={onNext}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-all flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest"
                    >
                      Next Part
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="space-y-6 flex-grow">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Primary Author</p>
                    <p className="text-lg font-bold text-slate-800">{book.author}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-8 py-6 border-y border-slate-100">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Available Copies</p>
                      <p className="text-2xl font-black text-lib-primary">{book.quantity}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Target Branch</p>
                      <p className="text-sm font-bold text-slate-800 uppercase italic leading-tight">{book.branch || 'General Repository'}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 italic text-slate-500 text-sm">
                    "This digital record represents an active asset within the BookBridge management system. All transactions involving this resource are tracked in real-time."
                  </div>
                </div>

                <div className="mt-10 flex gap-4">
                   <button 
                    onClick={handleRequest}
                    className={`flex-1 h-12 rounded-lg font-bold text-sm tracking-wide transition-all shadow-md active:scale-[0.98] ${
                      book.status === 'Available' 
                        ? 'bg-lib-primary text-white hover:bg-slate-800 shadow-lib-primary/20' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                    }`}
                    disabled={book.status !== 'Available'}
                   >
                     {book.status === 'Available' ? 'INITIALIZE BOOK REQUEST' : 'NOT ELIGIBLE FOR REQUEST'}
                   </button>
                   <button 
                    onClick={onClose}
                    className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg transition-all text-xs"
                   >
                     CLOSE
                   </button>
                </div>
                
                <p className="mt-6 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">
                  Tracking ID: <span className="text-slate-600 font-mono">{book.id}</span>
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 p-12 flex flex-col items-center justify-center text-center"
            >
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-8">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Request Successfully Initialized</h2>
              <p className="text-slate-500 max-w-sm mb-10 text-lg">
                Your request for <span className="font-bold text-slate-800">"{book.title}"</span> has been logged and queued for librarian approval.
              </p>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 w-full mb-10 text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex justify-between items-center">
                  What's Next?
                  {onNext && <span className="text-[9px] text-lib-primary animate-pulse">Click steps for next part</span>}
                </p>
                <ul className="space-y-4">
                  <li 
                    onClick={onNext}
                    className={`flex items-start gap-3 p-2 -m-2 rounded-xl transition-all ${onNext ? 'cursor-pointer hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]' : ''}`}
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex-shrink-0 flex items-center justify-center text-[10px] font-bold shadow-sm">1</div>
                    <p className="text-sm text-slate-600 font-medium">Verify your student credentials at the main desk.</p>
                  </li>
                  <li 
                    onClick={onNext}
                    className={`flex items-start gap-3 p-2 -m-2 rounded-xl transition-all ${onNext ? 'cursor-pointer hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]' : ''}`}
                  >
                    <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex-shrink-0 flex items-center justify-center text-[10px] font-bold shadow-sm">2</div>
                    <p className="text-sm text-slate-600 font-medium">Wait for the confirmation SMS or email notification.</p>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-4 w-full">
                {onNext && (
                  <button 
                    onClick={onNext}
                    className="w-full h-14 bg-lib-secondary text-white font-bold rounded-xl shadow-xl shadow-lib-secondary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    SHOW NEXT PART
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
                <button 
                  onClick={onClose}
                  className={`w-full h-14 font-bold rounded-xl transition-all ${
                    onNext 
                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                      : 'bg-lib-primary text-white shadow-xl shadow-lib-primary/20 hover:scale-[1.02]'
                  }`}
                >
                  RETURN TO CATALOG
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}


function BookModal({ isOpen, onClose, onSave, initialData }: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSave: (data: Omit<Book, 'id'>) => void,
  initialData: Book | null
}) {
  const [formData, setFormData] = useState<Omit<Book, 'id'>>({
    title: initialData?.title || '',
    author: initialData?.author || '',
    genre: initialData?.genre || 'Technical',
    quantity: initialData?.quantity || 1,
    status: initialData?.status || 'Available',
    coverImage: initialData?.coverImage || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white w-full max-w-xl shadow-2xl rounded-xl overflow-hidden"
      >
        <div className="bg-lib-primary p-8 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
              {initialData ? 'Modify Resource Metadata' : 'New Resource Entry'}
            </h2>
            <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">BookBridge Secure Node Integration Protocol v1.0</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Official Asset Title</label>
            <input 
              required
              type="text" 
              placeholder="ENTER RESOURCE NOMENCLATURE..."
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-lib-primary/20 focus:border-lib-primary text-slate-900 font-semibold transition-all"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Lead Contributor/Author</label>
              <input 
                required
                type="text" 
                placeholder="NAME..."
                value={formData.author}
                onChange={e => setFormData({ ...formData, author: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-lib-primary/20 focus:border-lib-primary text-slate-900 font-semibold transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Classification Tier</label>
              <select 
                value={formData.genre}
                onChange={e => setFormData({ ...formData, genre: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-lib-primary/20 focus:border-lib-primary text-slate-900 font-bold transition-all appearance-none"
              >
                <option value="Technical">Technical Operations</option>
                <option value="History">Archival History</option>
                <option value="Fiction">Creative Fiction</option>
                <option value="Biography">Individual Bio-Records</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Volume Inventory</label>
              <input 
                type="number" 
                min="0"
                value={formData.quantity}
                onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-lib-primary/20 focus:border-lib-primary text-slate-900 font-bold transition-all"
              />
            </div>
             <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Availability State</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-lib-primary/20 focus:border-lib-primary text-slate-900 font-bold transition-all appearance-none"
              >
                <option value="Available">Available (Online)</option>
                <option value="Reserved">Reserved (Assigned)</option>
                <option value="Out of Stock">Depleted / Archived</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Assigned Branch</label>
              <select 
                value={formData.branch}
                onChange={e => setFormData({ ...formData, branch: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-lib-primary/20 focus:border-lib-primary text-slate-900 font-bold transition-all appearance-none"
              >
                <option value="">None / General Library</option>
                {BRANCHES_DATA.flatMap(f => f.items).map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Cover Image URL</label>
              <input 
                type="url" 
                placeholder="https://images.unsplash.com/..."
                value={formData.coverImage}
                onChange={e => setFormData({ ...formData, coverImage: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-lib-primary/20 focus:border-lib-primary text-slate-900 font-semibold transition-all"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="submit"
              className="flex-grow lib-btn-primary hover:scale-[1.01] shadow-lg active:scale-[0.99] h-14 text-base font-bold shadow-lib-primary/20"
            >
              {initialData ? 'COMMIT RECORD UPDATE' : 'INITIALIZE REGISTRATION'}
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="px-8 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg transition-all text-xs"
            >
              DISCARD
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

