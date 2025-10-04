import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Account } from '../../types';
import { listAccounts } from '../../services/mockApi';

export default function AccountsScreen() {
  const { member } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    if (!member) return;
    setRefreshing(true);
    const data = await listAccounts(member.id);
    setAccounts(data);
    setRefreshing(false);
  };

  useEffect(() => {
    load();
  }, [member?.id]);

  return (
    <View style={styles.container}>
      <FlatList
        data={accounts}
        keyExtractor={(a) => a.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.type}</Text>
            <Text style={styles.amount}>{item.balance.toLocaleString()} {item.currency}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No accounts</Text>}
        contentContainerStyle={accounts.length === 0 ? styles.emptyContainer : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 8, textTransform: 'capitalize' },
  amount: { fontSize: 18, fontWeight: '700', color: '#065F46' },
  emptyContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { color: '#6B7280' },
});
