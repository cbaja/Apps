import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Account, Member } from '../../types';
import { listAccounts, makePayment, searchMembers } from '../../services/mockApi';

export default function PaymentsScreen() {
  const { member } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [recipientQuery, setRecipientQuery] = useState('');
  const [memberResults, setMemberResults] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!member) return;
      const accs = await listAccounts(member.id);
      setAccounts(accs);
      setSelectedAccountId(accs[0]?.id ?? null);
    })();
  }, [member?.id]);

  useEffect(() => {
    let active = true;
    (async () => {
      if (recipientQuery.length < 2) {
        setMemberResults([]);
        return;
      }
      const results = await searchMembers(recipientQuery);
      const filtered = results.filter((m) => m.id !== member?.id);
      if (active) setMemberResults(filtered);
    })();
    return () => {
      active = false;
    };
  }, [recipientQuery, member?.id]);

  const selectedAccount = useMemo(() => accounts.find((a) => a.id === selectedAccountId) ?? null, [accounts, selectedAccountId]);

  const onPay = async () => {
    try {
      if (!selectedAccount || !selectedMember) {
        Alert.alert('Missing info', 'Select account and recipient');
        return;
      }
      const amt = Number(amount);
      if (!amt || amt <= 0) {
        Alert.alert('Invalid amount', 'Enter a positive amount');
        return;
      }
      setLoading(true);
      await makePayment({
        fromAccountId: selectedAccount.id,
        toMemberId: selectedMember.id,
        amount: amt,
        currency: selectedAccount.currency,
        description,
      });
      Alert.alert('Success', 'Payment completed');
      setAmount('');
      setDescription('');
      setSelectedMember(null);
      setRecipientQuery('');
    } catch (e: any) {
      Alert.alert('Payment failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>From account</Text>
      <FlatList
        horizontal
        data={accounts}
        keyExtractor={(a) => a.id}
        style={{ marginBottom: 12 }}
        contentContainerStyle={{ gap: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedAccountId(item.id)} style={[styles.pill, selectedAccountId === item.id && styles.pillActive]}>
            <Text style={styles.pillText}>{item.type}</Text>
            <Text style={styles.pillSub}>{item.balance.toLocaleString()} {item.currency}</Text>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.label}>Recipient</Text>
      <TextInput placeholder="Search member by name or phone" style={styles.input} value={recipientQuery} onChangeText={(t) => { setRecipientQuery(t); setSelectedMember(null); }} />
      {selectedMember ? (
        <View style={styles.selected}>
          <Text>{selectedMember.fullName} ({selectedMember.phone})</Text>
        </View>
      ) : (
        <FlatList
          data={memberResults}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.row} onPress={() => setSelectedMember(item)}>
              <Text style={styles.name}>{item.fullName}</Text>
              <Text style={styles.phone}>{item.phone}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No results</Text>}
          style={{ maxHeight: 160, marginBottom: 12 }}
        />
      )}

      <Text style={styles.label}>Amount</Text>
      <TextInput
        placeholder="0.00"
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Description (optional)</Text>
      <TextInput placeholder="Note" style={styles.input} value={description} onChangeText={setDescription} />

      <Button title={loading ? 'Processing...' : 'Pay'} onPress={onPay} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontWeight: '700', marginBottom: 4, color: '#374151' },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 12, backgroundColor: '#FFFFFF', marginBottom: 12 },
  row: { paddingVertical: 8, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  name: { fontWeight: '600' },
  phone: { color: '#6B7280' },
  empty: { color: '#9CA3AF' },
  pill: { padding: 12, backgroundColor: '#F3F4F6', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  pillActive: { backgroundColor: '#ECFDF5', borderColor: '#10B981' },
  pillText: { fontWeight: '700' },
  pillSub: { fontSize: 12, color: '#6B7280' },
  selected: { padding: 12, borderWidth: 1, borderColor: '#10B981', backgroundColor: '#ECFDF5', borderRadius: 8, marginBottom: 12 },
});
