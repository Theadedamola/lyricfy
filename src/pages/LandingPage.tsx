import { CommunityPreview } from '../components/ComunityPreview'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import Navbar from '../components/navbar'

const LandingPage = () => {
  return (
    <div className="flex flex-col gap-24 md:gap-40 lg:gap-80">
      <Navbar />
      <Hero />
      <CommunityPreview />
      <Footer />
    </div>
  )
}
export default LandingPage
