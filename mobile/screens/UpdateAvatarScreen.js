import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";

const UpdateAvatarScreen = () => {
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [error, setError] = useState(null);

  const selectImage = () => {
    const options = {
      mediaType: "photo",
      includeBase64: false,
    };

    // Launch the image library (gallery)
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.log("ImagePicker Error: ", response.errorMessage);
      } else {
        // Set the URI of the selected image
        setImageUri(response.assets[0].uri);
      }
    });
  };

  // Function to upload the selected image
  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert("Error", "Please select an image first.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      type: "image/jpeg",  // Adjust based on the image type
      name: "profile.jpg",  // You can dynamically change the name if needed
    });

    try {
      const response = await fetch("http://your-laravel-backend/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        Alert.alert("Success", "Image uploaded successfully.");
      } else {
        throw new Error("Image upload failed");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to upload image. Please try again.");
      Alert.alert("Error", "Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Profile Picture</Text>

      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      ) : (
        <Text style={styles.placeholderText}>No image selected</Text>
      )}

      <TouchableOpacity style={styles.selectButton} onPress={selectImage}>
        <Text style={styles.buttonText}>Select Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Upload Image</Text>
        )}
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  placeholderText: {
    fontSize: 18,
    color: "#aaa",
    marginBottom: 20,
  },
  selectButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    marginTop: 20,
    color: "red",
  },
});

export default UpdateAvatarScreen;
