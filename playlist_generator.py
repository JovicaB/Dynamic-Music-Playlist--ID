from data import SC_FREQ_DISTRIBUTION, SC_CORRELATION
import random


VIEWPORT_ROWS_COUNTER = 8
scroll_down = False

class PlaylistConfiguration:
    def __init__(self, song_category) -> None:
        self.song_category = song_category

    def configure_playlist_generator(self):
        """
        Sets up a list of correlated song categories.
        
        Returns:
        list: A list of sorted most correlated music categories.
        """
        category_correlations = SC_CORRELATION[self.song_category]
        chosen_categories = list(reversed(sorted(category_correlations, key=lambda k: (category_correlations[k]))))[:1]
        chosen_categories.insert(0, self.song_category)
        return chosen_categories


class InitialViewportPlaylist(PlaylistConfiguration):
    def __init__(self, song_category) -> None:
        super().__init__(song_category)

    def generator(self):
        """
        Creates the visible segment of the playlist (visible to the user) by randomly selecting songs from the chosen song category.
        
        Returns:
        list: The visible playlist.
        """
        
        visible_playlist = [self.song_category for _ in range(VIEWPORT_ROWS_COUNTER)]
        random_index = random.randrange(VIEWPORT_ROWS_COUNTER - 5, VIEWPORT_ROWS_COUNTER -1)
        additional_category = self.configure_playlist_generator()[1]
        visible_playlist[random_index] = additional_category
        return visible_playlist


class DynamicPlaylistGenerator(PlaylistConfiguration):
    def __init__(self, song_category, extended_category=None) -> None:
        super().__init__(song_category)
        self.playlist_length = VIEWPORT_ROWS_COUNTER
        self.weights = SC_FREQ_DISTRIBUTION
        self.extended_category = extended_category

    def _generate_playlist(self):
        """
        # Generates the hidden segment of the playlist with randomized content, based on weights that determine the frequency distribution of songs.
        # Songs from other categories are chosen based on the correlation between categories. 

        # Yields:
        # str: The generated hidden playlist items, including other correlated song categories.
        """

    def generator(self):
        if self.extended_category is not None:
            first_category_playlist = [self.song_category for _ in range(VIEWPORT_ROWS_COUNTER - 5)]
            second_category_playlist = [self.extended_category for _ in range(VIEWPORT_ROWS_COUNTER - 4)]
            additional_category = SC_CORRELATION[self.extended_category]
            chosen_category = sorted(additional_category, key=lambda k:additional_category[k])[-2]
            playlist = first_category_playlist + second_category_playlist
            random.shuffle(playlist)
            playlist.append(chosen_category)
            random.shuffle(playlist)
        else:
            print(22222222222)
            playlist_default_category = [self.song_category for _ in range(VIEWPORT_ROWS_COUNTER - 2)]
            additional_category = self.configure_playlist_generator()[1]
            playlist_additional_category = [additional_category for _ in range(2)]
            playlist = playlist_default_category + playlist_additional_category
            random.shuffle(playlist)
        return playlist

# print(DynamicPlaylistGenerator('B', 'H').generator())