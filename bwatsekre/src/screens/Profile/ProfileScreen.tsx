import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { member, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {member && (
        <View style={styles.card}>
          <Text style={styles.row}><Text style={styles.label}>Name: </Text>{member.fullName}</Text>
          <Text style={styles.row}><Text style={styles.label}>Phone: </Text>{member.phone}</Text>
          <Text style={styles.row}><Text style={styles.label}>Type: </Text>{member.type}</Text>
          <Text style={styles.row}><Text style={styles.label}>Physical account: </Text>{member.hasPhysicalAccount ? 'Yes' : 'No'}</Text>
        </View>
      )}
      <Button title="Logout" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  row: { marginBottom: 6 },
  label: { color: '#6B7280' },
});
