import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';

function GameDetailsScreen({ route, navigation }) {
  const { game } = route.params || {};
  const [isFavorite, setIsFavorite] = useState(false);
  const db = SQLite.openDatabase('favorites.db');

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS favorites (id INTEGER PRIMARY KEY NOT NULL, name TEXT, description TEXT, image TEXT, genre TEXT, developer TEXT);'
      );
      if (game && game.id) {
        tx.executeSql(
          'SELECT * FROM favorites WHERE id = ?;',
          [game.id],
          (_, { rows }) => {
              const isFavorite = !!(rows.length > 0 && rows._array.length > 0);
              setIsFavorite(isFavorite);
            }
          );
        }
      });
    }, [game]);
  


  const handleFavorite = () => {
    db.transaction(tx => {
      if (isFavorite) {
        tx.executeSql('DELETE FROM favorites WHERE id = ?;', [game.id]);
        setIsFavorite(false);
      } else {
        tx.executeSql(
          'INSERT INTO favorites (id, name, description, image, genre, developer) VALUES (?, ?, ?, ?, ?, ?);',
          [game.id, game.name, game.description, game.image, game.genre, game.developer]
        );
        setIsFavorite(true);
      }
    });
  };

  if (!game) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Jogo não encontrado.</Text>
        <TouchableOpacity
          style={{ backgroundColor: '#66c0f4', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: '#171a21', alignItems: 'center' }}>
      <Image source={{ uri: game.image }} style={{ width: 200, height: 200, borderRadius: 16, marginBottom: 16, borderWidth: 3, borderColor: '#66c0f4' }} />
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 8, color: '#c7d5e0' }}>{game.name}</Text>
      <Text style={{ fontSize: 16, color: '#a4b0be', marginBottom: 8 }}>{game.genre} - {game.developer}</Text>
      <Text style={{ fontSize: 16, marginBottom: 24, textAlign: 'center', color: '#c7d5e0' }}>{game.description}</Text>
      <TouchableOpacity
        style={{ backgroundColor: isFavorite ? '#c00' : '#66c0f4', padding: 12, borderRadius: 8, marginBottom: 16 }}
        onPress={handleFavorite}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
          {isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
        </Text>
      </TouchableOpacity>
  <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
}

export default GameDetailsScreen;
