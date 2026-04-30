import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Heart, User, Clock, Activity, HelpCircle } from 'lucide-react-native';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import MonitoringScreen from './src/screens/MonitoringScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import EmergencyScreen from './src/screens/EmergencyScreen';
import HelpScreen from './src/screens/HelpScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const COLORS = {
  primary: '#6200EE',
  background: '#F8F9FA',
  card: '#FFFFFF',
  text: '#121212',
  lightText: '#666666',
  border: '#EEEEEE',
  red: '#FF5252',
  green: '#4CAF50',
  orange: '#FF9800',
  blue: '#2196F3'
};

const MainTabs = ({ userData, setUserData, history }) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarStyle: { backgroundColor: COLORS.card, height: 70, paddingBottom: 12, paddingTop: 8 },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.lightText,
      headerStyle: { backgroundColor: COLORS.card, elevation: 0 },
      headerTintColor: COLORS.text,
      tabBarIcon: ({ color, size }) => {
        if (route.name === 'Monitoring') return <Activity size={size} color={color} />;
        if (route.name === 'History') return <Clock size={size} color={color} />;
        if (route.name === 'Help') return <HelpCircle size={size} color={color} />;
        if (route.name === 'Profile') return <User size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Monitoring" options={{ title: 'Vitals' }}>
      {props => <MonitoringScreen {...props} user={userData} colors={COLORS} />}
    </Tab.Screen>
    <Tab.Screen name="History" options={{ title: 'Logs' }}>
      {props => <HistoryScreen {...props} history={history} colors={COLORS} />}
    </Tab.Screen>
    <Tab.Screen name="Help" component={HelpScreen} />
    <Tab.Screen name="Profile">
      {props => <ProfileScreen {...props} user={userData} onUpdate={setUserData} colors={COLORS} />}
    </Tab.Screen>
  </Tab.Navigator>
);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Mitesh', age: 25, gender: 'Male', height: 175, weight: 70, bloodGroup: 'B+', goal: 'Muscle Gain',
    hasDisease: 'No', 
    diseaseName: '', 
    diseaseDesc: '', 
    severity: 'None',
    symptoms: '',
    sinceWhen: '',
    doctorName: '',
    medicineName: 'Vitamin D', dosage: '1000 IU', frequency: 'Once Daily', medTime: 'Morning',
    emergencyContact: '9876543210', relation: 'Brother',
    workoutType: 'Strength', duration: '45 mins', calories: '320 kcal', steps: '8400',
    bodyTemp: 98.6
  });

  const [history] = useState([
    { id: '1', date: 'Today, 10:30 AM', hr: 72, spo2: 98, temp: 98.4, status: 'Normal' },
    { id: '2', date: 'Yesterday, 4:15 PM', hr: 115, spo2: 96, temp: 99.1, status: 'Active' },
  ]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: COLORS.card }, headerTintColor: COLORS.text }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {props => <LoginScreen {...props} onLogin={() => setIsAuthenticated(true)} colors={COLORS} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Main" options={{ headerShown: false }}>
              {props => <MainTabs userData={userData} setUserData={setUserData} history={history} />}
            </Stack.Screen>
            <Stack.Screen name="Emergency" component={EmergencyScreen} options={{ title: 'Emergency Response' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
