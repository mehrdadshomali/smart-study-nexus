import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { View, StyleSheet } from 'react-native'
import { colors, borderRadius } from '../constants/theme'

import HomeScreen from '../screens/HomeScreen'
import NotesScreen from '../screens/NotesScreen'
import NewNoteScreen from '../screens/NewNoteScreen'
import FoldersScreen from '../screens/FoldersScreen'
import FilesScreen from '../screens/FilesScreen'
import QuizScreen from '../screens/QuizScreen'
import ProfileScreen from '../screens/ProfileScreen'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home'

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline'
          } else if (route.name === 'Notes') {
            iconName = focused ? 'document-text' : 'document-text-outline'
          } else if (route.name === 'Files') {
            iconName = focused ? 'images' : 'images-outline'
          } else if (route.name === 'Quiz') {
            iconName = focused ? 'play-circle' : 'play-circle-outline'
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline'
          }

          return (
            <View style={focused ? styles.activeTab : undefined}>
              <Ionicons name={iconName} size={22} color={color} />
            </View>
          )
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.borderLight,
          borderTopWidth: 1,
          height: 85,
          paddingTop: 8,
          paddingBottom: 28,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 17,
          color: colors.text,
        },
        headerTintColor: colors.text,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ 
          title: 'Ana Sayfa',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Notes"
        component={NotesScreen}
        options={{ title: 'Notlar' }}
      />
      <Tab.Screen
        name="Files"
        component={FilesScreen}
        options={{ title: 'Dosyalar' }}
      />
      <Tab.Screen
        name="Quiz"
        component={QuizScreen}
        options={{ title: 'Quiz' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profil' }}
      />
    </Tab.Navigator>
  )
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 17,
            color: colors.text,
          },
          headerTintColor: colors.primary,
        }}
      >
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NewNote"
          component={NewNoteScreen}
          options={{ 
            headerShown: false, 
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="Folders"
          component={FoldersScreen}
          options={{ title: 'Klasörler' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  activeTab: {
    backgroundColor: colors.primaryMuted,
    borderRadius: borderRadius.md,
    padding: 6,
    marginBottom: -4,
  },
})
