import SectionNavigation from '@/components/SectionNavigation';
import { StudioProvider } from '@/components/StudioProvider';
import CinematicLoader from '@/components/CinematicLoader';
import ReactiveSurfaces from '@/components/ReactiveSurfaces';
import SceneMotion from '@/components/SceneMotion';
import ExperienceStory from '@/components/ExperienceStory';
import MaterialLab from '@/components/MaterialLab';
import ProcessStory from '@/components/ProcessStory';
import ScrollProgress from '@/components/ScrollProgress';
import StudioCursor from '@/components/StudioCursor';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Marketplace from '@/components/Marketplace';
import Projects from '@/components/Projects';
import ProjectCTA from '@/components/ProjectCTA';
import FAQ from '@/components/FAQ';
import MobilityStory from '@/components/MobilityStory';
import Footer from '@/components/Footer';
export default function Home() {
  return <StudioProvider><SectionNavigation/><StudioCursor /><CinematicLoader /><SceneMotion /><ScrollProgress /><ReactiveSurfaces /><Header /><main><Hero /><Marketplace /><ExperienceStory /><Projects /><MaterialLab /><MobilityStory /><ProcessStory /><ProjectCTA /><FAQ /></main><Footer /></StudioProvider>;
}
