start:
	source ./.venv/Scripts/activate
	uvicorn main:app --reload
end:
	echo "ending"
