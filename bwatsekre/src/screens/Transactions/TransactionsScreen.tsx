import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TextInput } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Transaction } from '../../types';
import { listAccounts, listTransactions } from '../../services/mockApi';

export default function TransactionsScreen() {
  const { member } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');

  const load = async () => {
    if (!member) return;
    setRefreshing(true);
    const accs = await listAccounts(member.id);
    const data = await listTransactions(accs.map((a) => a.id));
    setTransactions(data);
    setRefreshing(false);
  };

  useEffect(() => {
    load();
  }, [member?.id]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return transactions;
    return transactions.filter((t) =>
      t.type.includes(q) || (t.description ?? '').toLowerCase().includes(q)
    );
  }, [transactions, query]);

  return (
    <View style={styles.container}>
      <TextInput placeholder="Search (type or description)" style={styles.input} value={query} onChangeText={setQuery} />
      <FlatList
        data={filtered}
        keyExtractor={(t) => t.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View>
              <Text style={styles.type}>{item.type.toUpperCase()}</Text>
              {item.description ? <Text style={styles.desc}>{item.description}</Text> : null}
              <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
            </View>
            <Text style={[styles.amount, item.type === 'deposit' ? styles.plus : styles.minus]}>
              {item.type === 'deposit' ? '+' : '-'}{item.amount.toLocaleString()} {item.currency}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No transactions</Text>}
        contentContainerStyle={filtered.length === 0 ? styles.emptyContainer : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 12, backgroundColor: '#FFFFFF', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  type: { fontSize: 12, fontWeight: '700', color: '#374151' },
  desc: { fontSize: 12, color: '#6B7280' },
  date: { fontSize: 10, color: '#9CA3AF' },
  amount: { fontSize: 16, fontWeight: '700' },
  plus: { color: '#059669' },
  minus: { color: '#DC2626' },
  emptyContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { color: '#6B7280' },
});
