import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';
import { User } from '../types';

interface DashboardScreenProps {
  navigation: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const [user, setUser] = useState<User | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    githubConnected: false,
    trelloConnected: false,
    aiRequestsToday: 0,
    dailyLimit: 15,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
      
      // Load user stats from API
      const response = await api.get('/api/auth/me');
      if (response.data.user) {
        setUser(response.data.user);
        setStats({
          githubConnected: response.data.user._count.githubAccounts > 0,
          trelloConnected: response.data.user._count.trelloAccounts > 0,
          aiRequestsToday: response.data.user._count.aiRequests || 0,
          dailyLimit: response.data.user.tier === 'PRO' ? 200 : 15,
        });
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name || user?.email}!</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.cardTitle}>Today's Usage</Text>
        <Text style={styles.statsText}>
          {stats.aiRequestsToday} / {stats.dailyLimit} AI requests
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(stats.aiRequestsToday / stats.dailyLimit) * 100}%` },
            ]}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Integrations</Text>
        
        <TouchableOpacity
          style={[styles.integrationCard, stats.githubConnected && styles.connected]}
          onPress={() => navigation.navigate('GitHubConnect')}
        >
          <Text style={styles.integrationTitle}>GitHub</Text>
          <Text style={styles.integrationStatus}>
            {stats.githubConnected ? 'Connected ✓' : 'Tap to connect'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.integrationCard, stats.trelloConnected && styles.connected]}
          onPress={() => Alert.alert('Coming Soon', 'Trello integration coming soon!')}
        >
          <Text style={styles.integrationTitle}>Trello</Text>
          <Text style={styles.integrationStatus}>
            {stats.trelloConnected ? 'Connected ✓' : 'Coming soon'}
          </Text>
        </TouchableOpacity>
      </View>

      {user?.tier === 'FREE' && (
        <TouchableOpacity
          style={styles.upgradeCard}
          onPress={() => Alert.alert('Upgrade to Pro', 'Pro features coming soon!')}
        >
          <Text style={styles.upgradeTitle}>Upgrade to Pro</Text>
          <Text style={styles.upgradeText}>
            Unlock unlimited AI requests and premium features
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  logoutText: {
    color: '#007AFF',
    fontSize: 16,
  },
  statsCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  statsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  integrationCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  connected: {
    borderColor: '#4CAF50',
  },
  integrationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  integrationStatus: {
    fontSize: 14,
    color: '#666',
  },
  upgradeCard: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  upgradeText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
});