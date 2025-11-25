
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const db = SQLite.openDatabase('favorites.db');

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS favorites (id INTEGER PRIMARY KEY NOT NULL, name TEXT, description TEXT, image TEXT, genre TEXT, developer TEXT);');
      tx.executeSql('SELECT * FROM favorites;', [], (_, { rows }) => {
        setFavorites(rows._array);
      });
    });
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8, backgroundColor: '#eee', borderRadius: 8, padding: 8 }}
      onPress={() => navigation.navigate('GameDetails', { game: item })}
    >
      <Image source={{ uri: item.image }} style={{ width: 80, height: 80, borderRadius: 8, marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
        <Text style={{ color: '#555' }}>{item.genre} - {item.developer}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#171a21' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#c7d5e0' }}>Meus Favoritos</Text>
      {favorites.length === 0 ? (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: '#888', textAlign: 'center', marginBottom: 16 }}>Nenhum jogo favorito ainda.</Text>
          <TouchableOpacity
            style={{ backgroundColor: '#66c0f4', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, alignSelf: 'center' }}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Voltar para Home</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8, backgroundColor: '#1b2838', borderRadius: 8, padding: 8 }}
              onPress={() => navigation.navigate('GameDetails', { game: item })}
            >
              <Image source={{ uri: item.image }} style={{ width: 80, height: 80, borderRadius: 8, marginRight: 12, borderWidth: 2, borderColor: '#66c0f4' }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#c7d5e0' }}>{item.name}</Text>
                <Text style={{ color: '#a4b0be' }}>{item.genre} - {item.developer}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
