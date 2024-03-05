from transformers import AutoTokenizer, FlaxLlamaForCausalLM
import numpy as np

# Load the pre-trained LLaMA model
tokenizer = AutoTokenizer.from_pretrained("afmck/testing-llama-tiny", legacy=False)
model = FlaxLlamaForCausalLM.from_pretrained("afmck/testing-llama-tiny")

# Example input prompt
input_prompt = "In this body of text, find all locations: Hi im from north 4th stree, want to come to my house at 5th avenue? Im always there when the time is write"

# Tokenize the input
inputs = tokenizer.encode(input_prompt, return_tensors="np")

# Generate one token at a time
output = model.generate(inputs, do_sample=True, max_length=50)

# Convert the tensor to a list of integers
token_ids = output[0].tolist()

# Flatten the list of lists into a single list
flat_token_ids = [item for sublist in token_ids for item in sublist]

# Decode the flat list of token IDs
answer = tokenizer.decode(flat_token_ids, skip_special_tokens=True)

print(f"Answer: {answer}")