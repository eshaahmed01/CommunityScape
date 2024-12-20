import { LogBox, Text } from "react-native";
import { View } from "react-native";
import { useEffect } from "react";
import Homescreen from "./screens/Homescreen";
import Favourites from "./screens/Favourites";
import Profile from "./screens/Profile";
import Search from "./screens/Search";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import BottomTabBar from "./components/BottomtabBar";
import TopLocations from "./screens/TopLocations";
import TopArchitects from "./screens/TopArchitects";
import LocationDetails from "./screens/LocationDetail";
import ProfileDetails from "./screens/ProfileDetails";
import Category from "./screens/Category";
import SplashScreen from "./screens/splash";
import Login from "./screens/signin";
import SignUp from "./screens/signup";
import Sign from "./screens/sign";
import map from "./screens/map";
import mapS from "./screens/mapS";
import Estates from "./screens/Estates";
import PropertyDetail from "./screens/PropertyDetail";
import ReviewsDetail from "./screens/ReviewsDetail";
import OtherPropertyDetail from "./screens/OtherPropertyDetail";
import ArchitectProfile from "./screens/ArchitectProfile";
import LandDetail from "./screens/LandDetail";
import ArchitecturalDetails from "./screens/ArchitecturalDetails";
import HomeModels from "./screens/HomeModels";
import CostEstimates from "./screens/CostEstimates";
import Camera from "./screens/camera";
import ForgotPassword from "./screens/forgetpassword";
import LocationForm from "./screens/LocationForm";
import LocationSuggestions from "./screens/LocationSuggestions";
import SuggestionDetail from "./screens/SuggestionDetail";
import Community from "./screens/Community";
import Role from "./screens/Role";
import SellerDashboard from "./screens/SellerDashboard";
import Ad from "./screens/Ad";
import SellerTabBar from "./components/SellerTabBar";
import ListingForm from "./screens/ListingForm";
import ListingForm2 from "./screens/ListingForm2";
import ListingForm3 from "./screens/ListingForm3";
import EditProfile from "./screens/EditProfile";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { colours } from "./constants/colours";
import fonts from "./constants/fonts";
import Leads from "./screens/Leads";
import ChatBotScreen from "./screens/ChatBotScreen";
import Investor from "./screens/Investor";
import InvestorProfile from "./screens/InvestorProfile";
import InvestorProperty from "./screens/InvestorProperty";
import CustomDrawer from "./components/CustomDrawer";
import Icon2 from 'react-native-vector-icons/Entypo'
import Icon from 'react-native-vector-icons/Ionicons'
import Icon3 from 'react-native-vector-icons/Foundation'
import Icon4 from 'react-native-vector-icons/AntDesign'
import Survey from "./screens/Survey";
import EmailHelp from "./screens/EmailHelp";
import FAQ from "./screens/FAQ";
import InvestorTabBar from "./components/InvestorTab";
import InvestorGroups from "./screens/InvestorGroups";
import CreateGroup1 from "./screens/CreateGroup1";
import CreateGroup2 from "./screens/CreateGroup2";
import GroupDetails from "./screens/GroupDetails";
import GroupChatScreen from "./screens/GroupChatScreen";
import Posts from "./screens/Posts";

LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const config = {
  headerShown: false,
};
const HomeTab = () => (
  <Tab.Navigator
    tabBar={(props) => <BottomTabBar {...props} />}
    screenOptions={config}
  >
    <Tab.Screen name="Home" component={DrawerTabs} />
    <Tab.Screen name="Search" component={Search} />
    <Tab.Screen name="LandDetail" component={LandDetail} />
    <Tab.Screen name="Profile" component={Profile} />
  </Tab.Navigator>
);
const SellerTab = () => (
  <Tab.Navigator
    tabBar={(props) => <SellerTabBar {...props} />}
    screenOptions={config}
  >
    <Tab.Screen name="SellerDashboard" component={SellerDashboard} />
    <Tab.Screen name="Search" component={Search} />
    <Tab.Screen name="Ads" component={Ad} />
    <Tab.Screen name="Profile" component={Profile} />
  </Tab.Navigator>

)

const InvestorTab = () => (
  <Tab.Navigator
    tabBar={(props) => <InvestorTabBar {...props} />}
    screenOptions={config}
  >
    <Tab.Screen name="InvestorProperty" component={InvestorDrawer} />
    <Tab.Screen name="Search" component={Search} />
    <Tab.Screen name="Ads" component={Ad} />
    <Tab.Screen name="Profile" component={Profile} />
  </Tab.Navigator>

)
const DrawerTabs = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawer {...props} />}
    screenOptions={{
      headerShown: false,
      drawerLabelStyle: { color: colours.primary, fontWeight: '600', fontFamily: fonts.LatoBold, fontSize: 20, marginLeft: -20 },
      drawerItemStyle: { paddingVertical: 0, marginBottom: "1%", marginLeft: "1%" },
    }}
  >

    <Drawer.Screen
      name="Home"
      component={Homescreen}
      options={{
        drawerIcon: () => <Icon2 name="home" size={22} color={colours.primary} />,
      }}
    />

    <Drawer.Screen
      name="Architect Profile"
      component={ArchitectProfile}
      options={{
        drawerIcon: () =>
          <Icon name="person" size={22} color={colours.primary} />,

      }}
    />
    <Drawer.Screen
      name="Favourites"
      component={Favourites}
      options={{
        drawerIcon: () =>
          <Icon3 name="heart" size={22} color={colours.primary} />,

      }}
    />

    <Drawer.Screen
      name="Survey"
      component={Survey}
      options={{
        drawerIcon: () =>
          <Icon4 name="questioncircle" size={22} color={colours.primary} />,

      }}
    />


  </Drawer.Navigator>
);


const InvestorDrawer = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawer {...props} />}
    screenOptions={{
      headerShown: false,
      drawerLabelStyle: { color: colours.primary, fontWeight: '600', fontFamily: fonts.LatoBold, fontSize: 20, marginLeft: -20 },
      drawerItemStyle: { paddingVertical: 0, marginBottom: "1%", marginLeft: "1%" },
    }}
  >

    <Drawer.Screen
      name="Investor Property"
      component={InvestorProperty}
      options={{
        drawerIcon: () => <Icon2 name="home" size={22} color={colours.primary} />,
      }}
    />

    <Drawer.Screen
      name="Architect Profile"
      component={ArchitectProfile}
      options={{
        drawerIcon: () =>
          <Icon name="person" size={22} color={colours.primary} />,

      }}
    />
    <Drawer.Screen
      name="Favourites"
      component={Favourites}
      options={{
        drawerIcon: () =>
          <Icon3 name="heart" size={22} color={colours.primary} />,

      }}
    />

    <Drawer.Screen
      name="Survey"
      component={Survey}
      options={{
        drawerIcon: () =>
          <Icon4 name="questioncircle" size={22} color={colours.primary} />,

      }}
    />


  </Drawer.Navigator>
);




function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={config}
        initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}

        />
        <Stack.Screen
          name="SignScreen"
          component={Sign}

        />

        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ChatBotScreen"
          component={ChatBotScreen}
        />


        <Stack.Screen
          name="Role"
          component={Role}
          options={{ headerShown: false }}
        />



        <Stack.Screen
          name="SignUp"
          component={SignUp}

        />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="Category" component={Category} />
        <Stack.Screen name="HomeTab" component={HomeTab} />
        <Stack.Screen
          name="ListingForm"
          component={ListingForm}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ListingForm2"
          component={ListingForm2}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ListingForm3"
          component={ListingForm3}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="FAQ"
          component={FAQ}
          options={{ headerShown: false }}
        />






        <Stack.Screen
          name="LocationForm"
          component={LocationForm}

        />

        <Stack.Screen
          name="LocationSuggestions"
          component={LocationSuggestions}

        />

        <Stack.Screen
          name="SuggestionDetail"
          component={SuggestionDetail}

        />

        <Stack.Screen
          name="Community"
          component={Community}

        />
        <Stack.Screen
          name="SellerTab"
          component={SellerTab}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Leads"
          component={Leads}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ArchitecturalDetails"
          component={ArchitecturalDetails}

        />
        <Stack.Screen
          name="HomeModels"
          component={HomeModels}

        />
        <Stack.Screen
          name="Camera"
          component={Camera}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CostEstimates"
          component={CostEstimates}

        />

        <Stack.Screen name="Estates" component={Estates} />

        <Stack.Screen
          name="PropertyDetail"
          component={PropertyDetail}

        />
        <Stack.Screen
          name="OtherPropertyDetail"
          component={OtherPropertyDetail}

        />
        <Stack.Screen
          name="InvestorProfile"
          component={InvestorProfile}

        />

        <Stack.Screen
          name="Posts"
          component={Posts}

        />

        <Stack.Screen
          name="Investor"
          component={Investor}

        />

        <Stack.Screen
          name="InvestorTab"
          component={InvestorTab}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="InvestorGroups"
          component={InvestorGroups}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="CreateGroup1"
          component={CreateGroup1}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="CreateGroup2"
          component={CreateGroup2}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="GroupDetails"
          component={GroupDetails}
          options={{ headerShown: false }}
        />


        <Stack.Screen
          name="GroupChatScreen"
          component={GroupChatScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ReviewsDetail"
          component={ReviewsDetail}

        />

        <Stack.Screen
          name="EmailHelp"
          component={EmailHelp}

        />
        <Stack.Screen name="TopLocations" component={TopLocations} />
        <Stack.Screen name="LocationDetails" component={LocationDetails} />
        <Stack.Screen name="TopArchitects" component={TopArchitects} />
        <Stack.Screen name="ProfileDetails" component={ProfileDetails} />


        <Stack.Screen
          name="map"
          component={map}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="mapS"
          component={mapS}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
