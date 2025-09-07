import BecomeOwnerSection from "./components/BecomeOwner";
import Categories from "./components/Categories";
import FeaturedListings from "./components/FeaturedListings";
import Footer from "./components/Footer";
import Newsletter from "./components/Newsletter";
import PopularListings from "./components/PopularListings";
import TopRatedListings from "./components/TopRatedListings";

export default function Home() {
  return (
    <div>
      <main className="mx-auto max-w-7xl">
        <Categories></Categories>
        <FeaturedListings></FeaturedListings>
        <PopularListings></PopularListings>
        <TopRatedListings></TopRatedListings>
        <BecomeOwnerSection></BecomeOwnerSection>
        <Newsletter></Newsletter>
      </main>
      <Footer></Footer>
    </div>
  );
}

