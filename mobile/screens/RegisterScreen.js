import React, { useState } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // For dropdowns
import { useNavigation } from '@react-navigation/native';
import { storeUserDetails } from '../services/AuthService';

const RegisterScreen = () => {
    const navigation = useNavigation();
    const [formData, setFormData] = useState({
        firstname: '',
        middlename: '',
        lastname: '',
        gender: '',
        birthday: '',
        civil_status: '',
        religion: '',
        status: 'Active',
        address: '',
        email: '',
        username: '',
        password: '',
        confirm_password: '',
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleInputChange = (field, value) => {
        if (field === 'birthday') {
            const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
            if (datePattern.test(value)) {
                const [month, day, year] = value.split('/');
                value = `${year}-${month}-${day}`;
            } else {
                setErrors((prev) => ({ ...prev, birthday: 'Invalid date format. Use MM/DD/YYYY.' }));
            }
        }
        setFormData((prev) => ({ ...prev, [field]: value }));
    };
    

    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstname) newErrors.firstname = 'First name is required.';
        if (!formData.lastname) newErrors.lastname = 'Last name is required.';
        if (!formData.gender) newErrors.gender = 'Gender is required.';
        if (!formData.birthday) newErrors.birthday = 'Birthday is required.';
        if (!formData.email) newErrors.email = 'Email is required.';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format.';
        if (!formData.password) newErrors.password = 'Password is required.';
        if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'Passwords do not match.';
        }
        if (!formData.address || !formData.address.toLowerCase().includes("lapay")) {
            newErrors.address = 'You are not a resident of Lapay';
        }
        if (!formData.religion) newErrors.religion = 'Religion is required.';
        return newErrors;
    };

    const handleRegister = async () => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        try {
            const response = await storeUserDetails(formData);
    
            if (response && response.success) {
                Alert.alert(
                    'Success',
                    'Registration completed successfully.',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'Login', params: '' }],
                                });
                            },
                        },
                    ],
                    { cancelable: false }
                );
            } else {
                Alert.alert(
                    'Error',
                    response.message || 'Failed to save test result.'
                );
            }
    
        } catch (err) {
            console.error('Error:', err);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        }
    };
    
    return (
        <SafeAreaView style={styles.wrapper}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>Personal Information</Text>
                {[{ label: 'First Name', field: 'firstname' },
                { label: 'Middle Name', field: 'middlename', optional: true },
                { label: 'Last Name', field: 'lastname' },
                ].map(({ label, field, optional }, idx) => (
                    <View key={idx} style={styles.inputGroup}>
                        <Text style={styles.label}>
                            {label} {optional && <Text style={styles.optional}>(Optional)</Text>}
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder={`Enter your ${label.toLowerCase()}`}
                            value={formData[field]}
                            onChangeText={(value) => handleInputChange(field, value)}
                        />
                        {errors[field] && <Text style={styles.error}>{errors[field]}</Text>}
                    </View>
                ))}

                {/* Gender Dropdown */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Gender</Text>
                    <View style={styles.picker}>
                        <Picker
                            selectedValue={formData.gender}
                            onValueChange={(value) => handleInputChange('gender', value)}
                            style={styles.pickerSelect}
                        >
                            <Picker.Item label="Select Gender" value="" />
                            <Picker.Item label="Male" value="Male" />
                            <Picker.Item label="Female" value="Female" />
                            <Picker.Item label="Other" value="Other" />
                        </Picker>
                    </View>
                    {errors.gender && <Text style={styles.error}>{errors.gender}</Text>}
                </View>

                {/* Civil Status Dropdown */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Civil Status</Text>
                    <View style={styles.picker}>
                        <Picker
                            selectedValue={formData.civil_status}
                            onValueChange={(value) => handleInputChange('civil_status', value)}
                            style={styles.pickerSelect}
                        >
                            <Picker.Item label="Select Civil Status" value="" />
                            <Picker.Item label="Single" value="Single" />
                            <Picker.Item label="Married" value="Married" />
                            <Picker.Item label="Divorce" value="Divorce" />
                            <Picker.Item label="Separated" value="Separated" />
                        </Picker>
                    </View>
                    {errors.civil_status && <Text style={styles.error}>{errors.civil_status}</Text>}
                </View>

                {/* Address Field */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your address"
                        value={formData.address}
                        onChangeText={(value) => handleInputChange('address', value)}
                    />
                    {errors.address && <Text style={styles.error}>{errors.address}</Text>}
                </View>

                {/* Religion Field */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Religion</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your religion"
                        value={formData.religion}
                        onChangeText={(value) => handleInputChange('religion', value)}
                    />
                    {errors.religion && <Text style={styles.error}>{errors.religion}</Text>}
                </View>

                {/* Birthday Field */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Birthday</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="MM/DD/YYYY"
                        value={formData.birthday}
                        onChangeText={(value) => handleInputChange('birthday', value)}
                    />
                    {errors.birthday && <Text style={styles.error}>{errors.birthday}</Text>}
                </View>

                <Text style={styles.header}>Account Information</Text>

                {[{ label: 'Email Address', field: 'email', keyboardType: 'email-address' },
                { label: 'Username', field: 'username', optional: true },
                ].map(({ label, field, optional, keyboardType }, idx) => (
                    <View key={idx} style={styles.inputGroup}>
                        <Text style={styles.label}>
                            {label} {optional && <Text style={styles.optional}>(Optional)</Text>}
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder={`Enter your ${label.toLowerCase()}`}
                            value={formData[field]}
                            onChangeText={(value) => handleInputChange(field, value)}
                            keyboardType={keyboardType}
                        />
                        {errors[field] && <Text style={styles.error}>{errors[field]}</Text>}
                    </View>
                ))}

                {/* Password with Show/Hide */}
                {[{ label: 'Password', field: 'password', show: showPassword, setShow: setShowPassword },
                { label: 'Confirm Password', field: 'password_confirmation', show: showConfirmPassword, setShow: setShowConfirmPassword },
                ].map(({ label, field, show, setShow }, idx) => (
                    <View key={idx} style={styles.inputGroup}>
                        <Text style={styles.label}>{label}</Text>
                        <View style={styles.passwordWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder={`Enter your ${label.toLowerCase()}`}
                                value={formData[field]}
                                onChangeText={(value) => handleInputChange(field, value)}
                                secureTextEntry={!show}
                            />
                            <TouchableOpacity onPress={() => setShow((prev) => !prev)}>
                                <Text style={styles.showHide}>{show ? 'Hide' : 'Show'}</Text>
                            </TouchableOpacity>
                        </View>
                        {errors[field] && <Text style={styles.error}>{errors[field]}</Text>}
                    </View>
                ))}

                <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                    <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: '#001f3f',
    },
    container: {
      padding: 20,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
      color: '#fff',
    },
    inputGroup: {
      marginBottom: 15,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 5,
      color: '#fff',
    },
    optional: {
      fontSize: 12,
      color: '#888',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      fontSize: 16,
      backgroundColor: '#fff',
    },
    pickerSelect: {
        height: 50,
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 5,
        borderColor: '#ccc',
        paddingLeft: 10,
    },
    error: {
      color: 'red',
      fontSize: 12,
      marginTop: 5,
    },
    registerButton: {
      backgroundColor: '#007BFF',
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 20,
    },
    registerButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    passwordWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    showHide: {
      color: '#007BFF',
      fontSize: 14,
    },
    picker: {
      marginBottom: 10,
    },
});

export default RegisterScreen;
