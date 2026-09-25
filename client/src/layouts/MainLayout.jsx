import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  return (
    <div>
      <Navbar />

      <main>
        {children}
      </main>

     <Footer/>
    </div>
  );
}

export default MainLayout;