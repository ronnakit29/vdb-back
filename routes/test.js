import axios from 'axios';

class Client {
	constructor() {
		this.api = axios.create({
			baseURL: 'http://your-api-url.com', // Replace with your API URL
		});
	}

	async createPromiseDocument(data) {
		try {
			const response = await this.api.post('/promise-document', data);
			return response.data;
		} catch (error) {
			// Handle error
			console.error(error);
			throw error;
		}
	}

	async getAllPromiseDocuments() {
		try {
			const response = await this.api.get('/promise-document');
			return response.data;
		} catch (error) {
			// Handle error
			console.error(error);
			throw error;
		}
	}

	async analysisPromiseByTypeAndDate() {
		try {
			const response = await this.api.get('/promise-document/analysis');
			return response.data;
		} catch (error) {
			// Handle error
			console.error(error);
			throw error;
		}
	}

	// Add other methods for the remaining routes

	// For example:
	// async checkCitizenPromiseListByCitizenID(citizenId) {
	//   try {
	//     const response = await this.api.get(`/promise-document/member/${citizenId}`);
	//     return response.data;
	//   } catch (error) {
	//     // Handle error
	//     console.error(error);
	//     throw error;
	//   }
	// }
}

export default Client;
