

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function HomeScreen({ navigation }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        // Busca jogos soulslike usando RAWG API
        const response = await axios.get('https://api.rawg.io/api/games', {
          params: {
            key: 'a326bbeeb9ac4c62938d22c34d230dae',
            search: 'souls',
            page_size: 10
          }
        });
        const data = response.data.results.map(game => ({
          id: game.id,
          name: game.name,
          description: game.released ? `Lançamento: ${game.released}` : '',
          image: game.background_image,
          genre: game.genres && game.genres.length > 0 ? game.genres[0].name : '',
          developer: game.developers && game.developers.length > 0 ? game.developers[0].name : ''
        }));
        setGames(data);
      } catch (error) {
        setGames([]);
      }
      setLoading(false);
    };
    fetchGames();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8, backgroundColor: '#eee', borderRadius: 8, padding: 8 }}
      onPress={() => navigation.navigate('GameDetails', { game: item })}
    >
      <Image source={{ uri: item.image }} style={{ width: 80, height: 80, borderRadius: 8, marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
        <Text style={{ color: '#555' }}>{item.genre} {item.developer ? `- ${item.developer}` : ''}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#171a21' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#c7d5e0' }}>SteamMobile - Jogos Soulslike</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#66c0f4" style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={games}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8, backgroundColor: '#1b2838', borderRadius: 8, padding: 8 }}
              onPress={() => navigation.navigate('GameDetails', { game: item })}
            >
              <Image source={{ uri: item.image }} style={{ width: 80, height: 80, borderRadius: 8, marginRight: 12, borderWidth: 2, borderColor: '#66c0f4' }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#c7d5e0' }}>{item.name}</Text>
                <Text style={{ color: '#a4b0be' }}>{item.genre} {item.developer ? `- ${item.developer}` : ''}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      <View style={{ marginTop: 16, alignItems: 'center' }}>
        <TouchableOpacity
          style={{ backgroundColor: '#66c0f4', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 }}
          onPress={() => navigation.navigate('Favorites')}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Ir para Favoritos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
