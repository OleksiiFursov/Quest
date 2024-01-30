import { useState, useEffect } from 'react';

export function useFetch(url, options = {}) {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const response = await fetch(url, options);
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				const result = await response.json();
				setData(result);
			} catch (error) {
				setError(error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();

		return () => {
			const controller = new AbortController();
			controller.abort();
		};
	}, [url, options]);

	return { data, error, loading };
}
