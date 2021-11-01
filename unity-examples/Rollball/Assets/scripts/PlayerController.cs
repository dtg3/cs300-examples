using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.InputSystem;
using TMPro;

public class PlayerController : MonoBehaviour
{
    public float speed = 0;
    private int score;
    private Rigidbody rb;
    private float movementX;
    private float movementY;
    public TextMeshProUGUI countText;
    public GameObject winTextObject;
    private bool jump;
    [SerializeField] int jumpForce = 10;
    // Start is called before the first frame update

    void Awake() 
    {
        jump = false;
    }
    void Start()
    {   
        score = 0;
        rb = GetComponent<Rigidbody>();
        SetCountText();
        winTextObject.SetActive(false);
    }

    void SetCountText()
    {
        countText.text = "Count: " + score.ToString();
        if (score == 14) {
            winTextObject.SetActive(true);
        }
    }

    void OnJump()
    {
        Debug.Log("JUMP!");
        jump = true;
    }

    void OnMove(InputValue movementValue)
    {
        Vector2 movementVector = movementValue.Get<Vector2>();
        movementX = movementVector.x;
        movementY = movementVector.y;
    }
    
    void FixedUpdate()
    {
        Vector3 movement = new Vector3(movementX, 0.0f, movementY);
        rb.AddForce(movement * speed);
        
        if (jump) {
            rb.AddForce(Vector3.up * jumpForce);
            jump = false;
        }
    }

    private void OnTriggerEnter(Collider other)
    {
        if (other.gameObject.CompareTag("PickUp"))
        {
            other.gameObject.SetActive(false);
            score = score + 1;
            SetCountText();
        }
    }
}
