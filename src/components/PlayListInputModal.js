import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TextInput,
  Dimensions,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { constStyles } from "../styles";
import { colors } from "../misc";

const PlayListInputModal = ({ visible, onClose, onSubmit }) => {
  const [playListName, setPlayListName] = useState("");

  const handleOnSubmit = () => {
    if (!playListName.trim()) {
      onClose();
    } else {
      onSubmit(playListName);
      setPlayListName("");
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.inputContainer}>
          <Text style={{ color: colors.ACTIVE_BG }}>Create New Playlist</Text>
          <TextInput
            value={playListName}
            onChangeText={(text) => setPlayListName(text)}
            style={styles.input}
          />
          <AntDesign
            name="check"
            size={24}
            color={colors.ACTIVE_FONT}
            style={styles.submitIcon}
            onPress={handleOnSubmit}
          />
        </View>
      </View>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[StyleSheet.absoluteFillObject, styles.modalBG]} />
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: constStyles.width - 20,
    height: 200,
    borderRadius: 10,
    backgroundColor: colors.ACTIVE_FONT,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: constStyles.width - 40,
    borderBottomWidth: 1,
    borderBottomColor: colors.ACTIVE_BG,
    fontSize: 18,
    paddingVertical: 5,
  },
  submitIcon: {
    padding: 10,
    backgroundColor: colors.ACTIVE_BG,
    borderRadius: 50,
    marginTop: 15,
  },
  modalBG: {
    backgroundColor: colors.MODAL_BG,
    zIndex: -1,
  },
});

export default PlayListInputModal;
